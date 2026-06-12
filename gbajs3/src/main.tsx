import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App.tsx';
import './index.css';

const staleBuildReloadSessionKey = 'netboy-stale-build-reload';

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const currentEntryScript =
    document
      .querySelector<HTMLScriptElement>('script[type="module"][src]')
      ?.getAttribute('src') ?? 'unknown-entry';

  if (sessionStorage.getItem(staleBuildReloadSessionKey) === currentEntryScript) {
    console.error('Failed to load updated NetBoy assets after reload.', event);
    return;
  }

  sessionStorage.setItem(staleBuildReloadSessionKey, currentEntryScript);
  window.location.reload();
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element is in index.html
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
