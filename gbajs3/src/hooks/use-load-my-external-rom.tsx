import * as bps from 'bps';
import { useCallback, useState } from 'react';

import { useAsyncData } from './use-async-data.tsx';
import { linkCartridgeInformation, applyCustomPatch } from '../components/modals/util-rom.tsx';
import { readerRequest } from '../utils/reader-client.ts';

type LoadExternalRomProps = {
  url: URL;
  fullName?: string;
  patchFile?: string | null;
};

const ipsHeader = 'PATCH';
const ipsFooter = 'EOF';

const readAscii = (data: Uint8Array, offset: number, length: number) =>
  String.fromCharCode(...data.slice(offset, offset + length));

const readUint16 = (data: Uint8Array, offset: number) =>
  (data[offset] << 8) | data[offset + 1];

const readUint24 = (data: Uint8Array, offset: number) =>
  (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];

const applyIpsPatch = (patch: Uint8Array, source: Uint8Array) => {
  if (readAscii(patch, 0, ipsHeader.length) !== ipsHeader) {
    throw new Error('Invalid IPS patch header');
  }

  let offset = ipsHeader.length;
  let target = new Uint8Array(source);

  const ensureTargetLength = (length: number) => {
    if (target.length >= length) return;

    const nextTarget = new Uint8Array(length);
    nextTarget.set(target);
    target = nextTarget;
  };

  while (offset < patch.length) {
    if (readAscii(patch, offset, ipsFooter.length) === ipsFooter) {
      offset += ipsFooter.length;

      if (offset + 3 <= patch.length) {
        target = target.slice(0, readUint24(patch, offset));
      }

      return target;
    }

    const patchOffset = readUint24(patch, offset);
    const patchSize = readUint16(patch, offset + 3);
    offset += 5;

    if (patchSize === 0) {
      const runLength = readUint16(patch, offset);
      const value = patch[offset + 2];
      offset += 3;

      ensureTargetLength(patchOffset + runLength);
      target.fill(value, patchOffset, patchOffset + runLength);
      continue;
    }

    ensureTargetLength(patchOffset + patchSize);
    target.set(patch.slice(offset, offset + patchSize), patchOffset);
    offset += patchSize;
  }

  throw new Error('Invalid IPS patch footer');
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
      setProgress(0);
      readerRequest('GET', fetchProps.url.toString(), 'arraybuffer', undefined, {
        timeoutMs: 180000,
        retries: 0,
        phase: 'downloading',
        onProgress: (progress) => {
          setProgress(progress.percent);
        }
      })
        .then(async (response) => {
          setProgress(100);
          const responseBuffer: ArrayBuffer = response;
          const file = new File([responseBuffer], fetchProps.fullName ?? fallbackFileName);
          
          if (fetchProps.patchFile !== null && fetchProps.patchFile !== undefined && fetchProps.patchFile !== ""){
            
            const patchFile = fetchProps.patchFile.startsWith('.')
              ? linkCartridgeInformation + fetchProps.patchFile.substring(1)
              : fetchProps.patchFile;

            console.log("applying patch to file: " + patchFile);

            if(patchFile.endsWith(".txt")){
              console.log("applying custom patch file");
              const fetchPropsCustomPatchFile = {
                fullName: fetchProps.fullName ?? fallbackFileName,
                patchFile
              };

              const sourceFile: Uint8Array<ArrayBuffer> = new Uint8Array(responseBuffer);
              const patchedFile = await applyCustomPatch(fetchPropsCustomPatchFile, sourceFile);
              resolve(patchedFile);
            } else {
              const ajaxPatch = new XMLHttpRequest();
              ajaxPatch.open("GET", patchFile, true);
              ajaxPatch.responseType = "arraybuffer";
              ajaxPatch.overrideMimeType("text/plain; charset=x-user-defined");

              
              ajaxPatch.onload = () => {
                const patchResponse = ajaxPatch.response as ArrayBuffer;
                const ppp: Uint8Array<ArrayBuffer> = new Uint8Array(patchResponse);
                const sourceFile: Uint8Array<ArrayBuffer> = new Uint8Array(responseBuffer);

                const target: Uint8Array = patchFile.toLowerCase().endsWith('.ips')
                  ? applyIpsPatch(ppp, sourceFile)
                  : bps.apply(bps.parse(ppp).instructions, sourceFile);
                const patchedBuffer = new ArrayBuffer(target.byteLength);
                new Uint8Array(patchedBuffer).set(target);
                
                const patchedFile = new File([patchedBuffer], fetchProps.fullName ?? fallbackFileName);
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
