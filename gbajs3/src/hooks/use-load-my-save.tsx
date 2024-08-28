import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';

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
      console.log(fetchProps.fullName);
      const ajax = new XMLHttpRequest();
      ajax.open("GET", fetchProps.url, true);
      ajax.responseType = "arraybuffer";
      ajax.overrideMimeType("text/plain; charset=x-user-defined");
      
      // Update the progress bar during download
      ajax.onprogress = function(event) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };

      ajax.onload = () => {
        if (ajax.status >= 200 && ajax.status < 300) {
          const contentDisposition = ajax.getResponseHeader('Content-Disposition');
          const fileName = contentDisposition
            ?.split(';')
            .pop()
            ?.split('=')
            .pop()
            ?.replace(/"/g, '');

          const fallbackFileName = decodeURIComponent(
            fetchProps.url.pathname.split('/').pop() ?? 'unknown_external.sav'
          );

          const file = new File([ajax.response], fetchProps.fullName ?? fileName ?? fallbackFileName);
          resolve(file);
        } else {
          reject(new Error(`Received unexpected status code: ${ajax.status}`));
        }
      };
      ajax.onerror = () => {
        console.error('Request failed'); // Debugging log
        reject(new Error('Network error occurred'));
      };

      ajax.send(null);
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

