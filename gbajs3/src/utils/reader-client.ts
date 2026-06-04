export type ReaderProgressPhase =
  | 'idle'
  | 'connecting'
  | 'downloading'
  | 'uploading'
  | 'verifying'
  | 'complete'
  | 'failed';

export type ReaderProgress = {
  phase: ReaderProgressPhase;
  loaded: number;
  total: number;
  percent: number;
  bytesPerSecond?: number;
  etaSeconds?: number;
  message: string;
};

export type ReaderRequestOptions = {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  expectedTotalBytes?: number;
  signal?: AbortSignal;
  phase?: ReaderProgressPhase;
  onProgress?: (progress: ReaderProgress) => void;
};

export type ReaderStatus = {
  firmware_version?: string;
  wifi_ip_address?: string;
  web_url?: string;
  ssl_enabled?: boolean;
  ssl_mode?: string;
  public_domain_update_status?: string;
  battery?: {
    millivolts?: number;
    percent?: number;
    adcMillivolts?: number;
    adcRaw?: number;
  };
  [key: string]: unknown;
};

export type ReaderConnectionTest = {
  ok: boolean;
  url: string;
  status?: ReaderStatus;
  message: string;
  error?: string;
};

const defaultReaderURL = 'https://192.168.1.3';
const readerURLStorageKey = 'netboy-reader-url';
const recentReadersStorageKey = 'netboy-recent-readers';
const maxRecentReaders = 8;

export class ReaderRequestError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'timeout'
      | 'abort'
      | 'network'
      | 'http'
      | 'parse'
      | 'unknown',
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ReaderRequestError';
  }
}

export const normalizeReaderURL = (value: string | null | undefined) => {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return defaultReaderURL;

  const withoutTrailingSlash = trimmedValue.replace(/\/+$/, '');
  return /^https?:\/\//i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `https://${withoutTrailingSlash}`;
};

export const getStoredReaderURL = () => {
  if (typeof window === 'undefined') return defaultReaderURL;
  return normalizeReaderURL(window.localStorage.getItem(readerURLStorageKey));
};

export const saveReaderURL = (url: string) => {
  if (typeof window === 'undefined') return normalizeReaderURL(url);
  const normalizedURL = normalizeReaderURL(url);
  window.localStorage.setItem(readerURLStorageKey, normalizedURL);
  rememberReaderURL(normalizedURL);
  return normalizedURL;
};

export const getInitialReaderURL = () => {
  if (typeof window === 'undefined') return defaultReaderURL;

  const params = new URLSearchParams(window.location.search);
  const queryURL = params.get('esp32_ip');
  if (queryURL) return saveReaderURL(queryURL);

  return getStoredReaderURL();
};

export const getIframeHostReaderURL = () => {
  if (typeof window === 'undefined') return null;
  if (window.location.hostname === 'localhost') return null;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(window.location.hostname)) {
    return normalizeReaderURL(window.location.host);
  }
  return null;
};

export const getRecentReaderURLs = () => {
  if (typeof window === 'undefined') return [];
  try {
    const recentReaders = JSON.parse(
      window.localStorage.getItem(recentReadersStorageKey) ?? '[]'
    );
    return Array.isArray(recentReaders)
      ? recentReaders.filter((url): url is string => typeof url === 'string')
      : [];
  } catch {
    return [];
  }
};

export const rememberReaderURL = (url: string) => {
  if (typeof window === 'undefined') return;
  const normalizedURL = normalizeReaderURL(url);
  const recentReaders = [
    normalizedURL,
    ...getRecentReaderURLs().filter((readerURL) => readerURL !== normalizedURL)
  ].slice(0, maxRecentReaders);
  window.localStorage.setItem(
    recentReadersStorageKey,
    JSON.stringify(recentReaders)
  );
};

const wait = (delayMs: number) =>
  new Promise((resolve) => window.setTimeout(resolve, delayMs));

const buildProgress = (
  phase: ReaderProgressPhase,
  loaded: number,
  total: number,
  startedAt: number
): ReaderProgress => {
  const elapsedSeconds = Math.max((Date.now() - startedAt) / 1000, 0.001);
  const bytesPerSecond = loaded / elapsedSeconds;
  const remainingBytes = Math.max(total - loaded, 0);
  const etaSeconds =
    total > 0 && bytesPerSecond > 0 ? remainingBytes / bytesPerSecond : undefined;
  const percent = total > 0 ? Math.min((loaded / total) * 100, 100) : 0;

  return {
    phase,
    loaded,
    total,
    percent,
    bytesPerSecond,
    etaSeconds,
    message: describeProgressPhase(phase)
  };
};

export const describeProgressPhase = (phase: ReaderProgressPhase) => {
  switch (phase) {
    case 'connecting':
      return 'Connecting to cartridge reader...';
    case 'downloading':
      return 'Downloading from cartridge reader...';
    case 'uploading':
      return 'Uploading to cartridge reader...';
    case 'verifying':
      return 'Verifying cartridge data...';
    case 'complete':
      return 'Complete';
    case 'failed':
      return 'Reader request failed';
    default:
      return 'Waiting';
  }
};

const requestXHR = <T extends 'json' | 'arraybuffer' | 'text'>(
  method: 'GET' | 'POST',
  url: string,
  responseType: T,
  body?: XMLHttpRequestBodyInit,
  options: ReaderRequestOptions = {}
): Promise<T extends 'json' ? unknown : T extends 'arraybuffer' ? ArrayBuffer : string> => {
  const timeoutMs = options.timeoutMs ?? 45000;
  const phase = options.phase ?? (method === 'POST' ? 'uploading' : 'downloading');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startedAt = Date.now();
    let timeoutId = window.setTimeout(() => {
      xhr.abort();
      reject(
        new ReaderRequestError(
          `Reader did not respond within ${Math.round(timeoutMs / 1000)} seconds.`,
          'timeout'
        )
      );
    }, timeoutMs);

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      options.signal?.removeEventListener('abort', abortRequest);
    };

    const abortRequest = () => {
      xhr.abort();
      cleanup();
      reject(new ReaderRequestError('Reader request was cancelled.', 'abort'));
    };

    options.signal?.addEventListener('abort', abortRequest, { once: true });
    options.onProgress?.(buildProgress('connecting', 0, 0, startedAt));

    xhr.open(method, url, true);
    xhr.responseType = responseType === 'json' ? 'text' : responseType;
    if (responseType === 'arraybuffer') {
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }

    xhr.onprogress = (event) => {
      const total = event.lengthComputable
        ? event.total
        : options.expectedTotalBytes ?? 0;
      options.onProgress?.(
        buildProgress(
          phase,
          event.loaded,
          total,
          startedAt
        )
      );
    };

    xhr.upload.onprogress = (event) => {
      const total = event.lengthComputable
        ? event.total
        : options.expectedTotalBytes ?? 0;
      options.onProgress?.(
        buildProgress(
          phase,
          event.loaded,
          total,
          startedAt
        )
      );
    };

    xhr.onload = () => {
      cleanup();
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(
          new ReaderRequestError(
            `Reader returned HTTP ${xhr.status}.`,
            'http',
            xhr.status
          )
        );
        return;
      }

      options.onProgress?.(buildProgress('complete', 1, 1, startedAt));

      if (responseType === 'json') {
        try {
          resolve(JSON.parse(String(xhr.response || 'null')) as never);
        } catch (error) {
          reject(
            new ReaderRequestError(
              error instanceof Error ? error.message : 'Reader returned invalid JSON.',
              'parse'
            )
          );
        }
        return;
      }

      resolve(xhr.response as never);
    };

    xhr.onerror = () => {
      cleanup();
      reject(
        new ReaderRequestError(
          'Could not reach the reader. Check CORS, HTTPS certificate trust, and local-network browser permissions.',
          'network'
        )
      );
    };

    xhr.onabort = () => {
      cleanup();
      reject(new ReaderRequestError('Reader request was aborted.', 'abort'));
    };

    xhr.send(body);
  });
};

export const readerRequest = async <T extends 'json' | 'arraybuffer' | 'text'>(
  method: 'GET' | 'POST',
  url: string,
  responseType: T,
  body?: XMLHttpRequestBodyInit,
  options: ReaderRequestOptions = {}
) => {
  const retries = options.retries ?? (method === 'GET' ? 1 : 0);
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestXHR(method, url, responseType, body, options);
    } catch (error) {
      lastError = error;
      if (
        error instanceof ReaderRequestError &&
        (error.code === 'abort' || error.code === 'http')
      ) {
        throw error;
      }
      if (attempt < retries) await wait(options.retryDelayMs ?? 800);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new ReaderRequestError('Reader request failed.', 'unknown');
};

export const readerURL = (baseURL: string, path: string, params?: Record<string, string | number | undefined>) => {
  const url = new URL(path, `${normalizeReaderURL(baseURL)}/`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const readerGetJSON = (baseURL: string, path: string, options?: ReaderRequestOptions) =>
  readerRequest('GET', readerURL(baseURL, path), 'json', undefined, options);

export const getReaderWifiSettings = (baseURL: string, options?: ReaderRequestOptions) =>
  readerGetJSON(baseURL, '/get_wifi_settings', options) as Promise<ReaderStatus>;

export const getReaderGameInfo = (baseURL: string, options?: ReaderRequestOptions) =>
  readerGetJSON(baseURL, '/get_game_info', options);

export const downloadReaderSave = (
  baseURL: string,
  saveType?: number,
  options?: ReaderRequestOptions
) =>
  readerRequest(
    'GET',
    readerURL(baseURL, '/get_current_save', { saveType }),
    'arraybuffer',
    undefined,
    { ...options, phase: 'downloading', timeoutMs: options?.timeoutMs ?? 90000 }
  ) as Promise<ArrayBuffer>;

export const downloadReaderRom = (
  baseURL: string,
  path: '/get_current_game.gba' | '/get_current_game.gb',
  params: Record<string, string | number | undefined>,
  options?: ReaderRequestOptions
) =>
  readerRequest('GET', readerURL(baseURL, path, params), 'arraybuffer', undefined, {
    ...options,
    phase: 'downloading',
    retries: options?.retries ?? 0,
    timeoutMs: options?.timeoutMs ?? 180000
  }) as Promise<ArrayBuffer>;

export const uploadReaderSave = (
  baseURL: string,
  save: XMLHttpRequestBodyInit,
  saveType?: number,
  options?: ReaderRequestOptions
) =>
  readerRequest('POST', readerURL(baseURL, '/upload_save_file', { saveType }), 'text', save, {
    ...options,
    phase: 'uploading',
    timeoutMs: options?.timeoutMs ?? 120000
  });

export const verifyReaderSave = (
  baseURL: string,
  save: XMLHttpRequestBodyInit,
  saveType?: number,
  options?: ReaderRequestOptions
) =>
  readerRequest('POST', readerURL(baseURL, '/verify_save_file', { saveType }), 'text', save, {
    ...options,
    phase: 'verifying',
    timeoutMs: options?.timeoutMs ?? 120000
  });

export const uploadReaderRom = (
  baseURL: string,
  rom: XMLHttpRequestBodyInit,
  cartSize?: number,
  options?: ReaderRequestOptions
) =>
  readerRequest('POST', readerURL(baseURL, '/upload_rom_file', { cartSize }), 'text', rom, {
    ...options,
    phase: 'uploading',
    timeoutMs: options?.timeoutMs ?? 300000
  });

export const verifyReaderRom = (
  baseURL: string,
  rom: XMLHttpRequestBodyInit,
  cartSize?: number,
  options?: ReaderRequestOptions
) =>
  readerRequest('POST', readerURL(baseURL, '/verify_rom_file', { cartSize }), 'text', rom, {
    ...options,
    phase: 'verifying',
    timeoutMs: options?.timeoutMs ?? 300000
  });

export const explainReaderError = (error: unknown) => {
  if (error instanceof ReaderRequestError) {
    if (error.code === 'timeout') {
      return 'The cartridge reader did not respond before the timeout. Check power, Wi-Fi, and whether another operation is still running.';
    }
    if (error.code === 'network') {
      return 'The browser could not reach the reader. Trust the HTTPS certificate, verify the IP address, and check CORS/local-network access.';
    }
    if (error.code === 'http') {
      return `The reader returned HTTP ${error.status ?? 'error'}. Check cartridge type, save type, and firmware compatibility.`;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : String(error);
};

export const testReaderConnection = async (baseURL: string): Promise<ReaderConnectionTest> => {
  const url = normalizeReaderURL(baseURL);
  try {
    const status = await getReaderWifiSettings(url, {
      timeoutMs: 8000,
      retries: 1,
      phase: 'connecting'
    });
    saveReaderURL(url);
    return {
      ok: true,
      url,
      status,
      message: `Connected to reader${status.firmware_version ? ` firmware ${status.firmware_version}` : ''}.`
    };
  } catch (error) {
    return {
      ok: false,
      url,
      message: explainReaderError(error),
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
