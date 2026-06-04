import { useEffect, useState } from 'react';

import {
  mGBAEmulator,
  type GBAEmulator
} from '../emulator/mgba/mgba-emulator.tsx';

const isolationReloadSessionKey = 'gbajs3-cross-origin-isolation-reload';

const hasCOIServiceWorkerScript = () =>
  !!document.querySelector('script[src*="coi-sw"]');

const isCOIServiceWorkerRegistration = (registration: ServiceWorkerRegistration) =>
  [registration.active, registration.installing, registration.waiting].some(
    (worker) => worker?.scriptURL.includes('coi-sw')
  );

const ensureCrossOriginIsolated = async () => {
  if (window.crossOriginIsolated) return true;

  const hasReloaded = sessionStorage.getItem(isolationReloadSessionKey);
  const registrations =
    'serviceWorker' in navigator
      ? await navigator.serviceWorker.getRegistrations()
      : [];
  const hasCOIServiceWorker =
    hasCOIServiceWorkerScript() ||
    registrations.some(isCOIServiceWorkerRegistration);

  if (hasCOIServiceWorker) {
    if (!hasReloaded) {
      sessionStorage.setItem(isolationReloadSessionKey, 'true');

      if (!registrations.some(isCOIServiceWorkerRegistration)) {
        await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((resolve) => window.setTimeout(resolve, 1500))
        ]);
      }

      window.location.reload();
      return false;
    }

    console.error(
      'mGBA requires a cross-origin isolated page. The COOP/COEP service worker is present, but the page is still not isolated. Hard-refresh the GitHub Pages tab or unregister the site service worker and reload.'
    );

    return false;
  }

  if (!hasReloaded && navigator.serviceWorker?.controller) {
    sessionStorage.setItem(isolationReloadSessionKey, 'true');

    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );

    window.location.reload();
    return false;
  }

  console.error(
    'mGBA requires a cross-origin isolated page. Open the local app from http://localhost:5173/, or use a GitHub Pages build that includes the COOP/COEP service worker.'
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
