import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';

type LoadReflashRomProps = {
  romFile: File;
  esp32IP: string
};

export const useLoadReflashRom = () => {
  const [progress, setProgress] = useState(0);
  const executeLoadReflashRom = useCallback(
  (fetchProps?: LoadReflashRomProps): Promise<boolean> => {
    if (!fetchProps) {
      // Return a rejected promise if fetchProps is undefined
      return Promise.reject(new Error('fetchProps is required'));
    }

    return new Promise((resolve, reject) => {
      console.log("Reflashing Cartridge...");

      let cartSize = fetchProps.romFile.size;      
      const reader = new FileReader();

      reader.onload = (e) => {
          if(e.target && e.target.result) {
              let arrayBuffer = e.target.result;
              if (typeof arrayBuffer === 'string') {
                  // Convert string to ArrayBuffer
                  const encoder = new TextEncoder();
                  arrayBuffer = encoder.encode(arrayBuffer);
              }
              let romFile = new Uint8Array(arrayBuffer);

              const xhr = new XMLHttpRequest();
              xhr.open('POST', `${fetchProps.esp32IP}/upload_rom_file?cartSize=${cartSize}`, true);

              // Update the progress bar during the upload (client to server)
              xhr.upload.onprogress = function(event) {
                if (event.lengthComputable) {
                  const percentComplete = (event.loaded / event.total) * 67;
                  setProgress(percentComplete);
                }
              };

              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {                  
                  const xhrVerify = new XMLHttpRequest();
                  xhrVerify.open('POST', `${fetchProps.esp32IP}/verify_rom_file?cartSize=${cartSize}`, true);

                  // Update the progress bar during the upload (client to server)
                  xhrVerify.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                      const percentComplete = 67 + ((event.loaded / event.total) * 33);
                      setProgress(percentComplete);
                    }
                  };

                  xhrVerify.onload = () => {
                    if (xhrVerify.status >= 200 && xhrVerify.status < 300) {
                      resolve(true);
                    } else {
                      reject('Rom on cartridge has errors');
                    }
                  };

                  xhrVerify.onerror = () => reject('Failed to upload rom for verification'); // Handles network errors

                  xhrVerify.send(romFile);
                  
                } else {
                  reject('Failed to upload rom to cartridge');
                }
              };

              xhr.onerror = () => reject('Failed to upload rom to cartridge'); // Handles network errors

              xhr.send(romFile);
          }
      };
      reader.readAsArrayBuffer(fetchProps.romFile);
    });
  },
  []
);

  const { data, isLoading, error, execute } = useAsyncData({
    fetchFn: executeLoadReflashRom,
    clearDataOnLoad: true
  });

  return { data, isLoading, error, execute, progress };
};

