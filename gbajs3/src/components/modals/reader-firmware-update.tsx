import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent
} from 'react';

import { ModalBody } from './modal-body.tsx';
import { ModalHeader } from './modal-header.tsx';
import {
  explainReaderError,
  getInitialReaderURL,
  getReaderWifiSettings,
  saveReaderURL,
  uploadReaderFirmwareUpdate,
  type ReaderProgress,
  type ReaderStatus
} from '../../utils/reader-client.ts';

type FirmwareManifest = {
  version: string;
  firmware: string;
  filename?: string;
  releasedAt?: string;
  minVersion?: string;
  sha256?: string;
  size?: number;
  notes?: string[];
};

const defaultManifestURL =
  'https://raw.githubusercontent.com/webesp124/netboy-firmware-updates/main/manifest.json';

const UpdateBody = styled(ModalBody)`
  max-height: calc(90dvh - 73px);
`;

const Panel = styled('section')`
  background: ${({ theme }) => theme.modalSurface};
  border: 1px solid ${({ theme }) => theme.modalBorder};
  border-radius: 8px;
  padding: 16px;
`;

const DropArea = styled('label')<{ $isDragging: boolean }>`
  display: block;
  border: 1px dashed
    ${({ $isDragging, theme }) =>
      $isDragging ? theme.palette.primary.main : theme.modalBorderStrong};
  border-radius: 8px;
  background: ${({ theme }) => theme.modalDropzoneSurface};
  padding: 22px;
  text-align: center;
  cursor: pointer;
`;

const HiddenInput = styled('input')`
  display: none;
`;

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'unknown size';
  const units = ['B', 'KiB', 'MiB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const parseManifest = (value: unknown): FirmwareManifest => {
  if (!value || typeof value !== 'object') {
    throw new Error('Manifest JSON must be an object.');
  }

  const manifest = value as Partial<FirmwareManifest>;
  if (!manifest.version || !manifest.firmware) {
    throw new Error('Manifest must include version and firmware fields.');
  }

  return {
    ...manifest,
    version: manifest.version,
    firmware: manifest.firmware
  };
};

const getFirmwareURL = (manifestURL: string, manifest: FirmwareManifest) =>
  new URL(manifest.firmware, manifestURL).toString();

const sha256 = async (file: Blob) => {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const fileFromManifest = async (
  manifestURL: string,
  manifest: FirmwareManifest
) => {
  const firmwareURL = getFirmwareURL(manifestURL, manifest);
  const response = await fetch(firmwareURL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Firmware download failed with HTTP ${response.status}.`);
  }

  const blob = await response.blob();
  const filename =
    manifest.filename ?? firmwareURL.split('/').pop() ?? 'firmware.bin';
  return new File([blob], filename, {
    type: 'application/octet-stream'
  });
};

export const ReaderFirmwareUpdateModal = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [readerURL, setReaderURL] = useState(getInitialReaderURL);
  const [manifestURL, setManifestURL] = useState(defaultManifestURL);
  const [manifest, setManifest] = useState<FirmwareManifest | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ReaderStatus | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<ReaderProgress | null>(null);

  const firmwareURL = useMemo(
    () => (manifest ? getFirmwareURL(manifestURL, manifest) : ''),
    [manifest, manifestURL]
  );

  const normalizedReaderURL = () => {
    const nextReaderURL = saveReaderURL(readerURL);
    setReaderURL(nextReaderURL);
    return nextReaderURL;
  };

  const setFile = async (file: File) => {
    setSelectedFile(file);
    setMessage(`Selected ${file.name} (${formatBytes(file.size)}).`);
    setError('');

    if (manifest?.sha256) {
      const digest = await sha256(file);
      if (digest.toLowerCase() !== manifest.sha256.toLowerCase()) {
        setError('Selected firmware does not match the manifest SHA-256.');
        return false;
      } else {
        setMessage(`Selected ${file.name}; SHA-256 matches the manifest.`);
      }
    }

    return true;
  };

  const loadManifest = async () => {
    setIsBusy(true);
    setError('');
    setMessage('Loading update manifest...');
    try {
      const response = await fetch(manifestURL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Manifest request failed with HTTP ${response.status}.`);
      }
      const nextManifest = parseManifest(await response.json());
      setManifest(nextManifest);
      setSelectedFile(null);
      setMessage(`Loaded update ${nextManifest.version}.`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
      setMessage('');
    } finally {
      setIsBusy(false);
    }
  };

  const downloadManifestFirmware = async () => {
    if (!manifest) {
      setError('Load the manifest first.');
      return null;
    }

    setIsBusy(true);
    setError('');
    setMessage('Downloading firmware from GitHub...');
    try {
      const file = await fileFromManifest(manifestURL, manifest);
      return (await setFile(file)) ? file : null;
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
      setMessage('');
      return null;
    } finally {
      setIsBusy(false);
    }
  };

  const checkReader = async () => {
    setIsBusy(true);
    setError('');
    setMessage('Checking reader status...');
    try {
      const nextStatus = await getReaderWifiSettings(normalizedReaderURL(), {
        timeoutMs: 8000
      });
      setStatus(nextStatus);
      setMessage('Reader status loaded.');
    } catch (nextError) {
      setError(explainReaderError(nextError));
      setMessage('');
    } finally {
      setIsBusy(false);
    }
  };

  const uploadFirmware = async (file: File | null = selectedFile) => {
    const firmware = file ?? (await downloadManifestFirmware());
    if (!firmware) return;

    setIsBusy(true);
    setError('');
    setProgress(null);
    setMessage('Uploading firmware to NetBoy. Keep the reader powered.');
    try {
      const response = await uploadReaderFirmwareUpdate(
        normalizedReaderURL(),
        firmware,
        { username, password },
        {
          expectedTotalBytes: firmware.size,
          onProgress: setProgress
        }
      );
      setMessage(
        response.trim() === 'OK'
          ? 'Firmware uploaded. The reader is restarting now.'
          : `Reader response: ${response}`
      );
    } catch (nextError) {
      setError(explainReaderError(nextError));
      setMessage('');
    } finally {
      setIsBusy(false);
    }
  };

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await setFile(file);
    event.target.value = '';
  };

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) await setFile(file);
    },
    [manifest]
  );

  const uploadPercent = progress?.percent ?? 0;

  return (
    <>
      <ModalHeader title="NetBoy Firmware Update" />
      <UpdateBody>
        <Stack spacing={2}>
          <Alert severity="warning">
            This updates the ESP32-S3 application image through the firmware OTA
            endpoint. Use a NetBoy ESP32-S3 firmware.bin file, not a bootloader
            or merged image.
          </Alert>

          <Panel>
            <Stack spacing={1.5}>
              <Typography variant="h6" component="h2">
                Reader
              </Typography>
              <TextField
                label="Reader endpoint"
                value={readerURL}
                onChange={(event) => {
                  setReaderURL(event.target.value);
                }}
                helperText="The public HTTPS URL or local reader URL that exposes /update."
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  label="OTA username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <TextField
                  label="OTA password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </Stack>
              <Button variant="outlined" disabled={isBusy} onClick={checkReader}>
                Check Reader Version
              </Button>
              {status && (
                <Typography variant="body2" color="text.secondary">
                  Current firmware:{' '}
                  {status.WifiBoyVersion ?? status.firmware_version ?? 'unknown'}
                </Typography>
              )}
            </Stack>
          </Panel>

          <Panel>
            <Stack spacing={1.5}>
              <Typography variant="h6" component="h2">
                GitHub Update
              </Typography>
              <TextField
                label="Manifest URL"
                value={manifestURL}
                onChange={(event) => {
                  setManifestURL(event.target.value);
                }}
                helperText="Default points at a GitHub raw manifest. The manifest can reference firmware.bin with a relative path."
              />
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button variant="outlined" disabled={isBusy} onClick={loadManifest}>
                  Load Manifest
                </Button>
                <Button
                  variant="outlined"
                  disabled={isBusy || !manifest}
                  onClick={() => {
                    void downloadManifestFirmware();
                  }}
                >
                  Download Update File
                </Button>
                <Button
                  variant="contained"
                  disabled={isBusy || !manifest}
                  onClick={() => {
                    void uploadFirmware();
                  }}
                >
                  Download and Install
                </Button>
              </Stack>
              {manifest && (
                <Box>
                  <Typography variant="body2">
                    Latest version: <b>{manifest.version}</b>
                    {manifest.releasedAt ? ` (${manifest.releasedAt})` : ''}
                  </Typography>
                  <Typography variant="body2">
                    Firmware:{' '}
                    <Link href={firmwareURL} target="_blank" rel="noreferrer">
                      {firmwareURL}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {manifest.size ? formatBytes(manifest.size) : 'not listed'}
                    {manifest.sha256 ? ` · SHA-256: ${manifest.sha256}` : ''}
                  </Typography>
                  {manifest.notes?.length ? (
                    <Typography variant="body2" color="text.secondary">
                      Notes: {manifest.notes.join(' ')}
                    </Typography>
                  ) : null}
                </Box>
              )}
            </Stack>
          </Panel>

          <Panel>
            <Stack spacing={1.5}>
              <Typography variant="h6" component="h2">
                Manual Update File
              </Typography>
              <DropArea
                $isDragging={isDragging}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => {
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <HiddenInput
                  ref={inputRef}
                  type="file"
                  accept=".bin,application/octet-stream"
                  onChange={handleFileInput}
                />
                <Typography sx={{ fontWeight: 700 }}>
                  Drop firmware.bin here or click to choose a file
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The file is uploaded as multipart field "update" to /update.
                </Typography>
              </DropArea>
              {selectedFile && (
                <Typography variant="body2">
                  Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
                </Typography>
              )}
              <Button
                variant="contained"
                disabled={isBusy || !selectedFile || !!error}
                onClick={() => {
                  void uploadFirmware();
                }}
              >
                Upload Selected File
              </Button>
            </Stack>
          </Panel>

          {progress && (
            <Box>
              <LinearProgress variant="determinate" value={uploadPercent} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {progress.message} {Math.round(uploadPercent)}%
              </Typography>
            </Box>
          )}

          {message && <Alert severity="info">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </UpdateBody>
    </>
  );
};
