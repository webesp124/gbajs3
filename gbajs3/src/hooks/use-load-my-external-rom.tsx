import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';
import * as bps from 'bps';

type LoadExternalRomProps = {
  url: URL;
  fullName: string;
  patchFile: string | null;
};

export const useLoadExternalRom = () => {
  const [progress, setProgress] = useState(0);
  const executeLoadExternalRom = useCallback(
  (fetchProps?: LoadExternalRomProps): Promise<File> => {
    if (!fetchProps) {
      // Return a rejected promise if fetchProps is undefined
      return Promise.reject(new Error('fetchProps is required'));
    }

    return new Promise((resolve, reject) => {
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
            fetchProps.url.pathname.split('/').pop() ?? 'unknown_external.gba'
          );

          const file = new File([ajax.response], fetchProps.fullName ?? fileName ?? fallbackFileName);
          
          if (fetchProps.patchFile != null && fetchProps.patchFile != ""){
            console.log("applying bps patch to file: " + fetchProps.patchFile);
            
            const ajaxPatch = new XMLHttpRequest();
            ajaxPatch.open("GET", fetchProps.patchFile, true);
            ajaxPatch.responseType = "arraybuffer";
            ajaxPatch.overrideMimeType("text/plain; charset=x-user-defined");

            
            ajaxPatch.onload = () => {
              const ppp = new Uint8Array(ajaxPatch.response);

              const {
                instructions,
                checksum
              } = bps.parse(ppp);

              console.log(checksum);
              
              const sourceFile = new Uint8Array(ajax.response);
              const target = bps.apply(instructions, sourceFile);
              
              const patchedFile = new File([target], fetchProps.fullName ?? fileName ?? fallbackFileName);
              resolve(patchedFile);
            }
            ajaxPatch.onerror = () => {
               console.error('Request for patch file failed'); // Debugging log
               reject(new Error('Network error occurred: Patch File'));
            };
            ajaxPatch.send(null);
            
          } else {
            console.log("resolved file");
            resolve(file);
          }
        } else {
          console.error('Request failed2');
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
    fetchFn: executeLoadExternalRom,
    clearDataOnLoad: true
  });

  return { data, isLoading, error, execute, progress };
};
