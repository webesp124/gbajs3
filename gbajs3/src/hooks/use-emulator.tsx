import { useEffect, useState } from 'react';

import {
  mGBAEmulator,
  type GBAEmulator
} from '../emulator/mgba/mgba-emulator.tsx';

const isolationReloadSessionKey = 'gbajs3-cross-origin-isolation-reload';

const ensureCrossOriginIsolated = async () => {
  if (window.crossOriginIsolated) return true;

  const hasReloaded = sessionStorage.getItem(isolationReloadSessionKey);

  if (!hasReloaded && navigator.serviceWorker?.controller) {
    sessionStorage.setItem(isolationReloadSessionKey, 'true');

    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );

    window.location.reload();
    return false;
  }

  console.error(
    'mGBA requires a cross-origin isolated page. Open the app from http://localhost:5173/ and hard-refresh if this persists.'
  );

  return false;
};

export const useEmulator = (canvas: HTMLCanvasElement | null) => {
  const [emulator, setEmulator] = useState<GBAEmulator | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (canvas) {
        if (!(await ensureCrossOriginIsolated())) return;

        sessionStorage.removeItem(isolationReloadSessionKey);

        const { default: mGBA } = await import('@thenick775/mgba-wasm');
        const Module = await mGBA({ canvas });

        const mGBAVersion =
          Module.version.projectName + ' ' + Module.version.projectVersion;
        console.log(mGBAVersion);

        await Module.FSInit();

        const emulator = mGBAEmulator(Module);

        setEmulator(emulator);
      }
    };

    void initialize();
  }, [canvas]);

  return emulator;
};
