import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import './App.css';
import { ControlPanel } from './components/controls/control-panel.tsx';
import { VirtualControls } from './components/controls/virtual-controls.tsx';
import { ModalContainer } from './components/modals/modal-container.tsx';
import { NavigationMenu } from './components/navigation-menu/navigation-menu.tsx';
import { PwaPrompt } from './components/pwa-prompt/pwa-prompt.tsx';
import { ReaderSetupPage } from './components/reader-setup/reader-setup.tsx';
import { Screen } from './components/screen/screen.tsx';
import { AppErrorBoundary } from './components/shared/error-boundary.tsx';
import { ToasterWithDefaults } from './components/toast/toaster.tsx';
import { AuthProvider } from './context/auth/auth-provider.tsx';
import { EmulatorContextProvider } from './context/emulator/emulator-context-provider.tsx';
import { InitialBoundsProvider } from './context/initial-bounds/initial-bounds-provider.tsx';
import { LayoutProvider } from './context/layout/layout-provider.tsx';
import { ModalProvider } from './context/modal/modal-provider.tsx';
import { GbaDarkTheme } from './context/theme/theme.tsx';
import { getInitialReaderURL, saveReaderURL } from './utils/reader-client.ts';

const queryClient = new QueryClient();

const theme = createTheme(GbaDarkTheme);

const isReaderSetupPath = () =>
  /\/reader-setup(?:\.html)?$/.test(window.location.pathname);

export const App = () => {
  const [additionalData, setAdditionalData] = useState<any>(null);
  const [gameData, setGameData] = useState(null);
  const [esp32IP, setEsp32IPState] = useState(getInitialReaderURL);
  const setEsp32IP = (value: string) => {
    setEsp32IPState(saveReaderURL(value));
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <AppErrorBoundary>
          {isReaderSetupPath() ? (
            <ReaderSetupPage />
          ) : (
            <>
              <ToasterWithDefaults />
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <EmulatorContextProvider>
                    <InitialBoundsProvider>
                      <LayoutProvider>
                        <ModalProvider>
                          <main>
                            <PwaPrompt />
                            <NavigationMenu
                              additionalData={additionalData}
                              setAdditionalData={setAdditionalData}
                              gameData={gameData}
                              setGameData={setGameData}
                              esp32IP={esp32IP}
                              setEsp32IP={setEsp32IP}
                            />
                            <Screen />
                            <ControlPanel />
                            <VirtualControls
                              additionalData={additionalData}
                              esp32IP={esp32IP}
                            />
                            <ModalContainer />
                          </main>
                        </ModalProvider>
                      </LayoutProvider>
                    </InitialBoundsProvider>
                  </EmulatorContextProvider>
                </AuthProvider>
              </QueryClientProvider>
            </>
          )}
        </AppErrorBoundary>
      </StyledThemeProvider>
    </ThemeProvider>
  );
};
