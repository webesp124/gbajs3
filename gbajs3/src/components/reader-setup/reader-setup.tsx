import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';

import {
  explainReaderError,
  getInitialReaderURL,
  getReaderAvailableNetworks,
  getReaderWifiSettings,
  saveReaderURL,
  updateReaderWifiSettings
} from '../../utils/reader-client.ts';

import type {
  ReaderStatus,
  ReaderWifiNetwork,
  ReaderWifiUpdate
} from '../../utils/reader-client.ts';

const bleServiceUUID = '0000180d-0000-1000-8000-00805f9b34fb';
const bleDataCharacteristicUUID = '00002a37-0000-1000-8000-00805f9b34fb';
const bleCommandCharacteristicUUID = '00002a38-0000-1000-8000-00805f9b34fb';
const setupPath = '/wifi_setup';
const defaultSetupReaderURL = 'http://netboy.local';
const defaultApSetupURL = 'http://192.168.4.1/wifi_setup';
const alternateApSetupURL = 'http://192.168.1.4';
const defaultReaderHost = '192.168.1.3';

type SetupMethod = 'bluetooth' | 'web';

type BluetoothCharacteristic = {
  startNotifications: () => Promise<BluetoothCharacteristic>;
  addEventListener: (
    type: 'characteristicvaluechanged',
    listener: (event: Event & { target: { value?: DataView } }) => void
  ) => void;
  writeValue: (value: BufferSource) => Promise<void>;
};

type BluetoothNavigator = Navigator & {
  bluetooth?: {
    requestDevice: (options: {
      filters: { services: string[] }[];
    }) => Promise<{
      name?: string;
      gatt?: {
        connect: () => Promise<{
          getPrimaryService: (uuid: string) => Promise<{
            getCharacteristic: (uuid: string) => Promise<BluetoothCharacteristic>;
          }>;
        }>;
      };
    }>;
  };
};

type FormState = {
  ssid: string;
  password: string;
  manualSsid: boolean;
  createAp: boolean;
  apSsid: string;
  apPassword: string;
  webUrl: string;
  useDefaultSslCert: boolean;
  publicDomainUpdateUrl: string;
  certPem: string;
  keyPem: string;
};

type ReaderSetupContentProps = {
  standalone?: boolean;
};

const Page = styled('main')`
  min-height: 100dvh;
  width: 100%;
  overflow-y: auto;
  touch-action: pan-y;
  user-select: text;
  background: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 28px 16px 48px;
`;

const Shell = styled('div')`
  width: min(980px, 100%);
  margin: 0 auto;
  text-align: left;
`;

const Panel = styled('section')`
  background: ${({ theme }) => theme.modalSurface};
  border: 1px solid ${({ theme }) => theme.modalBorder};
  border-radius: 8px;
  padding: 18px;
`;

const FieldGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const PrimarySaveButton = styled(Button)`
  min-height: 48px;
  padding-left: 24px;
  padding-right: 24px;
  font-weight: 700;
`;

const MethodButton = styled(Button)<{ $selected: boolean }>`
  justify-content: flex-start;
  padding: 14px;
  min-height: 108px;
  text-align: left;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.palette.primary.main : theme.modalBorderStrong};
`;

const blankForm: FormState = {
  ssid: '',
  password: '',
  manualSsid: false,
  createAp: true,
  apSsid: 'NetBoy',
  apPassword: '',
  webUrl: 'default.webgba.dpdns.org',
  useDefaultSslCert: false,
  publicDomainUpdateUrl: '',
  certPem: '',
  keyPem: ''
};

const cleanHost = (value: string) =>
  value.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();

const networkName = (network: ReaderWifiNetwork) =>
  network.s ?? network.ssid ?? '';

const networkRssi = (network: ReaderWifiNetwork) =>
  network.r ?? network.rssi;

const chunkString = (value: string, size: number) => {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += size) {
    chunks.push(value.slice(index, index + size));
  }
  return chunks;
};

const statusToForm = (status: ReaderStatus, previous: FormState): FormState => ({
  ...previous,
  ssid: status.ssid ?? previous.ssid,
  createAp: status.is_creating_ap ?? previous.createAp,
  apSsid: status.ap_ssid ?? previous.apSsid,
  webUrl: status.web_url ?? previous.webUrl,
  useDefaultSslCert: status.use_default_ssl_cert ?? previous.useDefaultSslCert,
  publicDomainUpdateUrl:
    status.public_domain_update_url ?? previous.publicDomainUpdateUrl
});

const buildLinks = (status: ReaderStatus | null, readerURL: string) => {
  const readerBaseURL = /^https?:\/\//i.test(readerURL)
    ? readerURL
    : `http://${readerURL}`;
  const apHost = status?.ap_ip_address ?? '192.168.4.1';
  const mdnsHost =
    status?.mdns_enabled && status.mdns_host
      ? `${status.mdns_host}.local`
      : 'netboy.local';
  const localIp = status?.wifi_ip_address ?? apHost;
  const localURL = `https://${localIp}/`;
  const publicURL = status?.web_url ? `https://${status.web_url}/` : localURL;

  return {
    publicURL,
    localURL,
    apSetupURL: `http://${apHost}${setupPath}`,
    mdnsSetupURL: `http://${mdnsHost}${setupPath}`,
    readerSetupURL: new URL(
      setupPath,
      `${readerBaseURL.replace(/\/+$/, '')}/`
    ).toString()
  };
};

const buildWifiUpdate = (form: FormState, includeAdvanced: boolean) => {
  const payload: ReaderWifiUpdate = {
    ssid: form.ssid.trim(),
    password: form.password
  };

  if (includeAdvanced) {
    payload.create_ap = form.createAp;
    payload.ap_ssid = form.apSsid.trim();
    if (form.apPassword) payload.ap_password = form.apPassword;
    payload.web_url = cleanHost(form.webUrl);
    payload.use_default_ssl_cert = form.useDefaultSslCert;
    payload.public_domain_update_url = form.publicDomainUpdateUrl.trim();
  }

  return payload;
};

const messageSeverity = (message: string) =>
  message.toLowerCase().includes('failed') ||
  message.toLowerCase().includes('error') ||
  message.toLowerCase().includes('enter ')
    ? 'error'
    : 'info';

export const ReaderSetupContent = ({
  standalone = false
}: ReaderSetupContentProps) => {
  const [method, setMethod] = useState<SetupMethod>('web');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [readerURL, setReaderURL] = useState(() => {
    const initialReaderURL = getInitialReaderURL();
    return new URL(initialReaderURL).host === defaultReaderHost
      ? defaultSetupReaderURL
      : initialReaderURL;
  });
  const [form, setForm] = useState<FormState>(blankForm);
  const [status, setStatus] = useState<ReaderStatus | null>(null);
  const [networks, setNetworks] = useState<ReaderWifiNetwork[]>([]);
  const [webMessage, setWebMessage] = useState('');
  const [bluetoothMessage, setBluetoothMessage] = useState('');
  const [wifiMessage, setWifiMessage] = useState('');
  const [advancedMessage, setAdvancedMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isScanningNetworks, setIsScanningNetworks] = useState(false);
  const [bleCommandCharacteristic, setBleCommandCharacteristic] =
    useState<BluetoothCharacteristic | null>(null);
  const [bleConnectedName, setBleConnectedName] = useState('');

  const links = useMemo(() => buildLinks(status, readerURL), [readerURL, status]);
  const bluetooth =
    typeof navigator === 'undefined'
      ? undefined
      : (navigator as BluetoothNavigator).bluetooth;
  const bluetoothSupported =
    typeof navigator !== 'undefined' && !!bluetooth;

  const patchForm = (patch: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const applyStatus = (nextStatus: ReaderStatus) => {
    setStatus(nextStatus);
    setForm((current) => statusToForm(nextStatus, current));
  };

  const handleBleJson = (data: unknown) => {
    if (!data || typeof data !== 'object') return;
    const maybeNetworks = data as { n?: ReaderWifiNetwork[]; networks?: ReaderWifiNetwork[] };
    if (Array.isArray(maybeNetworks.n) || Array.isArray(maybeNetworks.networks)) {
      setNetworks(maybeNetworks.n ?? maybeNetworks.networks ?? []);
      setIsScanningNetworks(false);
      setWifiMessage('Bluetooth scan complete. Pick a network or type a hidden SSID manually.');
      return;
    }
    applyStatus(data as ReaderStatus);
    setBluetoothMessage('Loaded current NetBoy settings over Bluetooth.');
  };

  const writeBleCommand = async (payload: Record<string, unknown>) => {
    if (!bleCommandCharacteristic) {
      throw new Error('Connect to NetBoy Bluetooth first.');
    }
    await bleCommandCharacteristic.writeValue(
      new TextEncoder().encode(JSON.stringify(payload))
    );
  };

  const connectBluetooth = async () => {
    if (!bluetooth) {
      setBluetoothMessage('This browser does not expose Web Bluetooth. Use Chrome or Edge on desktop/Android, or use web setup over the NetBoy AP.');
      return;
    }

    setIsBusy(true);
    try {
      const device = await bluetooth.requestDevice({
        filters: [{ services: [bleServiceUUID] }]
      });
      const server = await device.gatt?.connect();
      if (!server) throw new Error('Bluetooth GATT server was unavailable.');
      const service = await server.getPrimaryService(bleServiceUUID);
      const dataCharacteristic = await service.getCharacteristic(
        bleDataCharacteristicUUID
      );
      const commandCharacteristic = await service.getCharacteristic(
        bleCommandCharacteristicUUID
      );

      await dataCharacteristic.startNotifications();
      dataCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        if (!value) return;
        const text = new TextDecoder().decode(value);
        try {
          handleBleJson(JSON.parse(text));
        } catch {
          setBluetoothMessage(`Bluetooth response was not JSON: ${text}`);
        }
      });

      setBleCommandCharacteristic(commandCharacteristic);
      setBleConnectedName(device.name ?? 'NetBoy');
      setBluetoothMessage('Bluetooth connected. Reading current settings...');
      await commandCharacteristic.writeValue(
        new TextEncoder().encode(JSON.stringify({ command: 'get_credentials' }))
      );
    } catch (error) {
      setBluetoothMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsBusy(false);
    }
  };

  const loadWebSettings = async () => {
    setIsBusy(true);
    try {
      const normalizedURL = saveReaderURL(readerURL);
      setReaderURL(normalizedURL);
      const nextStatus = await getReaderWifiSettings(normalizedURL, {
        timeoutMs: 8000
      });
      applyStatus(nextStatus);
      setWebMessage('Loaded current NetBoy settings. Scanning nearby Wi-Fi networks now...');
      setIsBusy(false);
      await scanWebNetworks(normalizedURL);
    } catch (error) {
      setWebMessage(explainReaderError(error));
    } finally {
      setIsBusy(false);
    }
  };

  const scanWebNetworks = async (baseURL = readerURL) => {
    setIsScanningNetworks(true);
    setWifiMessage('Scanning nearby Wi-Fi networks...');
    try {
      const response = await getReaderAvailableNetworks(baseURL, {
        timeoutMs: 15000
      });
      setNetworks(response.n ?? response.networks ?? []);
      setWifiMessage('Network scan complete. Pick a network or type a hidden SSID manually.');
    } catch (error) {
      setWifiMessage(explainReaderError(error));
    } finally {
      setIsScanningNetworks(false);
    }
  };

  const scanNetworks = async () => {
    if (method === 'bluetooth') {
      setIsScanningNetworks(true);
      setWifiMessage('Requesting Bluetooth network scan...');
      try {
        await writeBleCommand({ command: 'get_available_networks' });
        setWifiMessage('Bluetooth scan requested...');
      } catch (error) {
        setWifiMessage(explainReaderError(error));
        setIsScanningNetworks(false);
      }
      return;
    }

    await scanWebNetworks();
  };

  const sendPemOverBluetooth = async () => {
    if (!form.certPem && !form.keyPem) return;
    if (!form.certPem || !form.keyPem) {
      throw new Error('Certificate upload needs both the PEM certificate and PEM private key.');
    }

    const sendChunks = async (type: 'cert' | 'key', value: string) => {
      const chunks = chunkString(value, 350);
      for (const [bufferIndex, chunk] of chunks.entries()) {
        await writeBleCommand({
          command: 'set_ssl_cert_pem',
          type,
          bufferIndex,
          chunk,
          isLastChunk: bufferIndex === chunks.length - 1
        });
      }
    };

    await sendChunks('cert', form.certPem);
    await sendChunks('key', form.keyPem);
  };

  const saveSettings = async (includeAdvanced: boolean) => {
    const payload = buildWifiUpdate(form, includeAdvanced);
    if (!payload.ssid || !payload.password) {
      if (includeAdvanced) {
        setAdvancedMessage('Enter the internet Wi-Fi SSID and password in Minimal Wi-Fi Setup first.');
      } else {
        setWifiMessage('Enter the internet Wi-Fi SSID and password, then click Save Wi-Fi to finish setup.');
      }
      return;
    }

    setIsBusy(true);
    try {
      if (method === 'bluetooth') {
        await sendPemOverBluetooth();
        await writeBleCommand({ ...payload, command: 'set_credentials' });
        if (includeAdvanced) {
          setAdvancedMessage('Saved all options over Bluetooth. NetBoy is applying the network settings now.');
        } else {
          setWifiMessage('Saved Wi-Fi over Bluetooth. NetBoy is applying the network settings now.');
        }
        return;
      }

      await updateReaderWifiSettings(readerURL, payload);
      if (includeAdvanced) {
        setAdvancedMessage('Saved all options through the web setup endpoint. NetBoy is applying the network settings now.');
      } else {
        setWifiMessage('Saved Wi-Fi through the web setup endpoint. NetBoy is applying the network settings now.');
      }
    } catch (error) {
      if (includeAdvanced) {
        setAdvancedMessage(explainReaderError(error));
      } else {
        setWifiMessage(explainReaderError(error));
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      {standalone ? (
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            NetBoy Network Setup
          </Typography>
          <Typography color="text.secondary">
            A unified setup page for the GBA online emulator and ESP32-S3
            reader. The quick path only needs your internet Wi-Fi network;
            advanced device options are one layer deeper.
          </Typography>
        </Box>
      ) : (
        <Typography color="text.secondary">
          Configure the ESP32-S3 reader from the emulator. Start with only the
          internet Wi-Fi SSID and password; advanced device options are one
          layer deeper.
        </Typography>
      )}

          <Panel>
            <Typography variant="h6" component="h2" gutterBottom>
              Setup Method
            </Typography>
            <FieldGrid>
              <MethodButton
                variant="outlined"
                $selected={method === 'web'}
                onClick={() => {
                  setMethod('web');
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      Web setup over NetBoy AP
                    </Typography>
                    {method === 'web' && <Chip label="Selected" size="small" />}
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    Use this when Bluetooth is unavailable, blocked, or you prefer a normal page. Connect to the NetBoy Wi-Fi access point, then open its setup URL.
                  </Typography>
                </Stack>
              </MethodButton>
              <MethodButton
                variant="outlined"
                $selected={method === 'bluetooth'}
                onClick={() => {
                  setMethod('bluetooth');
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Bluetooth setup</Typography>
                    {method === 'bluetooth' && <Chip label="Selected" size="small" />}
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    Use this for first setup from a Web Bluetooth browser. You can configure NetBoy without joining its temporary Wi-Fi access point.
                  </Typography>
                </Stack>
              </MethodButton>
            </FieldGrid>
          </Panel>

          {method === 'web' ? (
            <Panel>
              <Typography variant="h6" component="h2" gutterBottom>
                Web/AP Connection
              </Typography>
              <Stack spacing={1.5}>
                <Alert severity="info">
                  First-time web setup: connect this phone or computer to the
                  NetBoy Wi-Fi AP named{' '}
                  <b>{form.apSsid.trim() ? form.apSsid : 'NetBoy'}</b>. Then click <b>Load Current Settings</b>.
                </Alert>
                <FieldGrid>
                  <TextField
                    label="Reader endpoint"
                    value={readerURL}
                    onChange={(event) => {
                      setReaderURL(event.target.value);
                    }}
                    helperText={`Usually leave this as ${defaultSetupReaderURL}. If netboy.local does not resolve while connected to the NetBoy AP, open ${defaultApSetupURL} or use ${alternateApSetupURL}. Change this only when you already know the reader's address on your normal Wi-Fi.`}
                  />
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={isBusy || isScanningNetworks}
                      startIcon={
                        isBusy || isScanningNetworks ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : undefined
                      }
                      onClick={loadWebSettings}
                    >
                      {isScanningNetworks
                        ? 'Scanning Networks...'
                        : 'Load Current Settings'}
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Reads saved settings from the reader endpoint above.
                    </Typography>
                  </Box>
                </FieldGrid>
                {webMessage && (
                  <Alert severity={messageSeverity(webMessage)}>
                    {webMessage}
                  </Alert>
                )}
              </Stack>
            </Panel>
          ) : (
            <Panel>
              <Typography variant="h6" component="h2" gutterBottom>
                Bluetooth Connection
              </Typography>
              <Stack spacing={1.5}>
                {!bluetoothSupported && (
                  <Alert severity="warning">
                  This browser does not support Web Bluetooth. Use Chrome or
                    Edge on desktop/Android, or switch to web setup over the
                    NetBoy AP.
                  </Alert>
                )}
                <Button
                  variant="contained"
                  disabled={isBusy || !bluetoothSupported}
                  onClick={connectBluetooth}
                >
                  {bleCommandCharacteristic
                    ? `Connected to ${bleConnectedName}`
                    : 'Connect to NetBoy Bluetooth'}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Bluetooth uses the ESP32-S3 service UUID from the firmware and
                  sends the same setup fields as the on-device BLE code. Keep the
                  reader powered and nearby while saving.
                </Typography>
                {bluetoothMessage && (
                  <Alert severity={messageSeverity(bluetoothMessage)}>
                    {bluetoothMessage}
                  </Alert>
                )}
              </Stack>
            </Panel>
          )}

          <Panel>
            <Typography variant="h6" component="h2" gutterBottom>
              Minimal Wi-Fi Setup
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Required for normal use: choose the internet-connected Wi-Fi
              network NetBoy should join and enter that network password. You
              can then access the NetBoy cartridge reader and emulator on the
              selected network.
            </Typography>
            <FieldGrid>
              <TextField
                select={!form.manualSsid}
                label="Wi-Fi SSID"
                value={form.ssid}
                onChange={(event) => {
                  patchForm({ ssid: event.target.value });
                }}
                helperText="The router or hotspot name NetBoy should join for normal emulator use."
              >
                <MenuItem value="">Select SSID</MenuItem>
                {networks.map((network) => {
                  const name = networkName(network);
                  const rssi = networkRssi(network);
                  return (
                    <MenuItem key={`${name}-${rssi ?? ''}`} value={name}>
                      {name}
                      {rssi !== undefined ? ` (RSSI ${rssi})` : ''}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                label="Wi-Fi password"
                type="password"
                value={form.password}
                onChange={(event) => {
                  patchForm({ password: event.target.value });
                }}
                helperText="The password for the selected internet Wi-Fi network. NetBoy saves it locally."
              />
            </FieldGrid>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', mt: 1.5 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.manualSsid}
                    onChange={(event) => {
                      patchForm({ manualSsid: event.target.checked });
                    }}
                  />
                }
                label="Type SSID manually for hidden or unlisted networks"
              />
            </Stack>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 2 }}
            >
              <Button
                variant="outlined"
                disabled={isBusy || isScanningNetworks}
                startIcon={
                  isScanningNetworks ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : undefined
                }
                onClick={() => {
                  void scanNetworks();
                }}
              >
                {isScanningNetworks ? 'Scanning...' : 'Scan Networks'}
              </Button>
              <PrimarySaveButton
                variant="contained"
                disabled={isBusy || isScanningNetworks}
                onClick={() => {
                  void saveSettings(false);
                }}
              >
                Save Wi-Fi and Finish Setup
              </PrimarySaveButton>
              <Button
                variant="text"
                onClick={() => {
                  setAdvancedOpen((current) => !current);
                }}
              >
                {advancedOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              After entering the SSID and password, click{' '}
              <b>Save Wi-Fi and Finish Setup</b>. NetBoy will apply the settings
              and move from setup mode to your normal Wi-Fi network.
            </Typography>
            {isScanningNetworks && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', mt: 1.5 }}
              >
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Scanning for nearby Wi-Fi networks...
                </Typography>
              </Stack>
            )}
            {wifiMessage && (
              <Alert
                severity={messageSeverity(wifiMessage)}
                sx={{ mt: 1.5 }}
              >
                {wifiMessage}
              </Alert>
            )}
          </Panel>

          {advancedOpen && (
            <Panel>
              <Typography variant="h6" component="h2" gutterBottom>
                Advanced Options
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Use these for recovery AP behavior, public emulator links,
                certificate handling, and domain update services. Leave them as
                they are for a normal first setup.
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.createAp}
                      onChange={(event) => {
                        patchForm({ createAp: event.target.checked });
                      }}
                    />
                  }
                  label="Keep NetBoy setup access point enabled"
                />
                <Typography variant="body2" color="text.secondary">
                  Enable this when you want a recovery/setup network available.
                  Disable it after station Wi-Fi is reliable if you want fewer
                  broadcasts.
                </Typography>
                <FieldGrid>
                  <TextField
                    label="Access point SSID"
                    value={form.apSsid}
                    onChange={(event) => {
                      patchForm({ apSsid: event.target.value });
                    }}
                    helperText="The Wi-Fi network name NetBoy broadcasts for setup and recovery."
                  />
                  <TextField
                    label="Access point password"
                    type="password"
                    value={form.apPassword}
                    onChange={(event) => {
                      patchForm({ apPassword: event.target.value });
                    }}
                    helperText="Use at least 8 characters. Leave blank to keep the current AP password."
                  />
                  <TextField
                    label="Public web URL"
                    value={form.webUrl}
                    onChange={(event) => {
                      patchForm({ webUrl: event.target.value });
                    }}
                    helperText="Hostname for the public emulator link, without https://. Use your webgba.dpdns.org name when configured."
                  />
                  <TextField
                    label="Public domain update URL"
                    value={form.publicDomainUpdateUrl}
                    onChange={(event) => {
                      patchForm({ publicDomainUpdateUrl: event.target.value });
                    }}
                    helperText="Advanced service endpoint that refreshes the public hostname or certificate configuration."
                  />
                </FieldGrid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.useDefaultSslCert}
                      onChange={(event) => {
                        patchForm({ useDefaultSslCert: event.target.checked });
                      }}
                    />
                  }
                  label="Use built-in SSL certificate"
                />
                <Typography variant="body2" color="text.secondary">
                  Use the built-in certificate for testing or local fallback. A
                  public hostname should use a matching stored certificate to
                  avoid browser warnings.
                </Typography>
                <Divider />
                <Typography sx={{ fontWeight: 700 }}>
                  Bluetooth-only certificate upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The ESP32-S3 BLE code accepts PEM certificate and key chunks.
                  The web/AP endpoint does not currently expose certificate PEM
                  upload, so these fields are sent only when Bluetooth setup is
                  selected.
                </Typography>
                <FieldGrid>
                  <TextField
                    label="PEM certificate"
                    value={form.certPem}
                    multiline
                    minRows={5}
                    onChange={(event) => {
                      patchForm({ certPem: event.target.value });
                    }}
                    helperText="Paste the full public certificate PEM when replacing the stored HTTPS certificate."
                  />
                  <TextField
                    label="PEM private key"
                    value={form.keyPem}
                    multiline
                    minRows={5}
                    type="password"
                    onChange={(event) => {
                      patchForm({ keyPem: event.target.value });
                    }}
                    helperText="Paste the matching private key PEM. Treat this as secret material."
                  />
                </FieldGrid>
                <Button
                  variant="contained"
                  disabled={isBusy}
                  onClick={() => {
                    void saveSettings(true);
                  }}
                >
                  Save All Options
                </Button>
                {advancedMessage && (
                  <Alert severity={messageSeverity(advancedMessage)}>
                    {advancedMessage}
                  </Alert>
                )}
              </Stack>
            </Panel>
          )}

          <Panel>
            <Typography variant="h6" component="h2" gutterBottom>
              Links And Status
            </Typography>
            <Stack spacing={1}>
              <Typography>
                Public/emulator link:{' '}
                <Link href={links.publicURL}>{links.publicURL}</Link>
              </Typography>
              <Typography>
                Local network link: <Link href={links.localURL}>{links.localURL}</Link>
              </Typography>
              <Typography>
                AP setup endpoint: <Link href={links.apSetupURL}>{links.apSetupURL}</Link>
              </Typography>
              <Typography>
                Current reader setup page:{' '}
                <Link href={links.readerSetupURL}>{links.readerSetupURL}</Link>
              </Typography>
              <Typography color="text.secondary">
                Public domain status:{' '}
                {status?.public_domain_update_status ?? 'unknown'}
                {status?.public_domain_update_http_code !== undefined
                  ? ` (HTTP ${status.public_domain_update_http_code})`
                  : ''}
              </Typography>
            </Stack>
          </Panel>

      {standalone && (
        <Button href="./" variant="text">
          Back to emulator
        </Button>
      )}
    </Stack>
  );
};

export const ReaderSetupPage = () => {
  return (
    <Page>
      <Shell>
        <ReaderSetupContent standalone />
      </Shell>
    </Page>
  );
};
