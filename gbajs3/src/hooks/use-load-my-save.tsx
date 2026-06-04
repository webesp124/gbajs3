import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';
import { readerRequest } from '../utils/reader-client.ts';

type LoadExternalSaveProps = {
  url: URL;
  fullName: string;
  expectedBytes?: number;
};

const gbaSaveSizeByType: Record<string, number> = {
  '1': 512,
  '2': 8192,
  '3': 32768,
  '4': 65536,
  '5': 131072,
  '6': 65536,
  '21': 131072,
  '55': 131072
};

const getExpectedSaveBytes = (fetchProps: LoadExternalSaveProps) => {
  if (fetchProps.expectedBytes) return fetchProps.expectedBytes;
  const saveType = fetchProps.url.searchParams.get('saveType');
  return saveType ? gbaSaveSizeByType[saveType] : undefined;
};

export const useLoadExternalSave = () => {
  const [progress, setProgress] = useState(0);
  const executeLoadExternalSave = useCallback(
  (fetchProps?: LoadExternalSaveProps): Promise<File> => {
    if (!fetchProps) {
      // Return a rejected promise if fetchProps is undefined
      return Promise.reject(new Error('fetchProps is required'));
    }

    return new Promise((resolve, reject) => {
      const fallbackFileName = decodeURIComponent(
        fetchProps.url.pathname.split('/').pop() ?? 'unknown_external.sav'
      );
      const expectedTotalBytes = getExpectedSaveBytes(fetchProps);

      setProgress(0);
      readerRequest('GET', fetchProps.url.toString(), 'arraybuffer', undefined, {
        timeoutMs: 90000,
        retries: 0,
        phase: 'downloading',
        expectedTotalBytes,
        onProgress: (progress) => {
          setProgress(progress.percent);
        }
      })
        .then((response) => {
          setProgress(100);
          const file = new File(
            [response as ArrayBuffer],
            fetchProps.fullName ?? fallbackFileName
          );
          resolve(file);
        })
        .catch(reject);
    });
  },
  []
);

  const { data, isLoading, error, execute } = useAsyncData({
    fetchFn: executeLoadExternalSave,
    clearDataOnLoad: true
  });

  return { data, isLoading, error, execute, progress };
};
