import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';
import {
  type ReaderProgress,
  uploadReaderRom,
  verifyReaderRom
} from '../utils/reader-client.ts';

type LoadReflashRomProps = {
  romFile: File;
  esp32IP: string
};

export const useLoadReflashRom = () => {
  const [progress, setProgress] = useState(0);
  const [readerProgress, setReaderProgress] = useState<ReaderProgress | null>(null);
  const executeLoadReflashRom = useCallback(
  (fetchProps?: LoadReflashRomProps): Promise<boolean> => {
    if (!fetchProps) {
      // Return a rejected promise if fetchProps is undefined
      return Promise.reject(new Error('fetchProps is required'));
    }

    return new Promise((resolve, reject) => {
      const isGba = fetchProps.romFile.name.toLowerCase().endsWith('.gba');
      const cartSize = isGba ? fetchProps.romFile.size : undefined;

      fetchProps.romFile.arrayBuffer()
        .then(async (romFile) => {
          await uploadReaderRom(fetchProps.esp32IP, romFile, cartSize, {
            onProgress: (nextProgress) => {
              setReaderProgress(nextProgress);
              setProgress(nextProgress.percent * 0.67);
            }
          });
          await verifyReaderRom(fetchProps.esp32IP, romFile, cartSize, {
            onProgress: (nextProgress) => {
              setReaderProgress(nextProgress);
              setProgress(67 + nextProgress.percent * 0.33);
            }
          });
          setProgress(100);
          resolve(true);
        })
        .catch(reject);
    });
  },
  []
);

  const { data, isLoading, error, execute } = useAsyncData({
    fetchFn: executeLoadReflashRom,
    clearDataOnLoad: true
  });

  return { data, isLoading, error, execute, progress, readerProgress };
};
