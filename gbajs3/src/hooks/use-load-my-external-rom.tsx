import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';
import * as bps from 'bps';
import { linkCartridgeInformation, applyCustomPatch } from '../components/modals/util-rom.tsx';
import { readerRequest } from '../utils/reader-client.ts';

type LoadExternalRomProps = {
  url: URL;
  fullName?: string;
  patchFile?: string | null;
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
      const fallbackFileName = decodeURIComponent(
        fetchProps.url.pathname.split('/').pop() ?? 'unknown_external.gba'
      );
      readerRequest('GET', fetchProps.url.toString(), 'arraybuffer', undefined, {
        timeoutMs: 180000,
        retries: 0,
        phase: 'downloading',
        onProgress: (progress) => {
          setProgress(progress.percent);
        }
      })
        .then(async (response) => {
          const responseBuffer = response as ArrayBuffer;
          const file = new File([responseBuffer], fetchProps.fullName ?? fallbackFileName);
          
          if (fetchProps.patchFile != null && fetchProps.patchFile != ""){
            
            console.log("applying patch to file: " + fetchProps.patchFile);
            if (fetchProps.patchFile.startsWith('.')) {
              fetchProps.patchFile = linkCartridgeInformation + fetchProps.patchFile.substring(1);
            }

            if(fetchProps.patchFile.endsWith(".txt")){
              console.log("applying custom patch file");
              const fetchPropsCustomPatchFile = {
                fullName: fetchProps.fullName ?? fallbackFileName,
                patchFile: fetchProps.patchFile
              };

              const sourceFile = new Uint8Array(responseBuffer);
              const patchedFile = await applyCustomPatch(fetchPropsCustomPatchFile, sourceFile);
              resolve(patchedFile);
            } else {
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
                
                const sourceFile = new Uint8Array(responseBuffer);
                const target = bps.apply(instructions, sourceFile);
                
                const patchedFile = new File([target as BlobPart], fetchProps.fullName ?? fallbackFileName);
                resolve(patchedFile);
              }
              ajaxPatch.onerror = () => {
                console.error('Request for patch file failed');
                reject(new Error('Network error occurred: Patch File'));
              };
              ajaxPatch.send(null);
            }


          } else {
            console.log("resolved file");
            resolve(file);
          }
        })
        .catch(reject);
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
