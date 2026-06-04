import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';
import { readerRequest } from '../utils/reader-client.ts';

type LoadExternalSaveProps = {
  url: URL;
  fullName: string;
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

      readerRequest('GET', fetchProps.url.toString(), 'arraybuffer', undefined, {
        timeoutMs: 90000,
        retries: 0,
        phase: 'downloading',
        onProgress: (progress) => {
          setProgress(progress.percent);
        }
      })
        .then((response) => {
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
