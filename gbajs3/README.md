# NetBoy

Wireless GBA/GB cartridge reader web interface and browser emulator.

## Reader Requirements

- ESP32-S3 cartridge reader firmware that exposes the HTTP API documented in `/home/a/Documents/gba_reader_s3/README.md`.
- HTTPS is recommended for the reader URL. Browsers may require trusting the reader certificate before local-network requests succeed.
- GB/GBC save upload and verify are supported by the firmware without a `saveType` URL parameter. GBA save upload and verify require the detected save type.

## Production Builds

Self-hosted production builds should serve the app with real cross-origin isolation headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: cross-origin
```

Build that version with:

```
npm run build:release
```

GitHub Pages cannot set those headers, so use the service-worker fallback build:

```
npm run build:github-pages
```

When embedding the GitHub Pages build inside the ESP32 page, the frame must allow local-network access:

```
<iframe src="https://webesp124.github.io/netboy?netboy_ip=https://READER_IP" allow="local-network-access"></iframe>
```

## Reader Setup UX

The cartridge start page stores the last reader URL, keeps recent readers, can use the current frame host when hosted by the ESP32, and includes a connection test against `/get_wifi_settings`.

Save writes and ROM reflashing perform a best-effort save backup before writing. Backups can be exported/imported from the cartridge start page.

ESP32-S3 firmware updates are available from the menu under `NetBoy Setup` -> `Update`. The default updater manifest is expected at `https://raw.githubusercontent.com/webesp124/netboy-firmware-updates/main/manifest.json`; see `firmware-updates/` for the required GitHub repository structure.

# Getting started

## Optional env variables

```
VITE_GBA_SERVER_LOCATION=https://localhost
```

The env above is used to communicate with the authorization server.

## Install dependencies

```
npm install;
```

## Development

To run the development server locally:

```
npm run dev;
```

Visit the url output after running the command above in your browser to see the application.

## Build

To build the application for production:

```
npm run build;
```

The build output will be in the `./dist` directory.

## Linting

To run the linter:

```
npm run lint;
```

To fix linting issues:

```
npm run lint:fix;
```

To assess vulnerabilities, run:

```
npm audit
```

## Additional commands

Use:

```
npm run;
```

to list available scripts
