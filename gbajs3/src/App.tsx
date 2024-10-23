import { ThemeProvider } from 'styled-components';

import './App.css';
import { ControlPanel } from './components/controls/control-panel.tsx';
import { VirtualControls } from './components/controls/virtual-controls.tsx';
import { ModalContainer } from './components/modals/modal-container.tsx';
import { NavigationMenu } from './components/navigation-menu/navigation-menu.tsx';
import { ProductTourIntro } from './components/product-tour/product-tour-intro.tsx';
import { PwaPrompt } from './components/pwa-prompt/pwa-prompt.tsx';
import { Screen } from './components/screen/screen.tsx';
import { AppErrorBoundary } from './components/shared/error-boundary.tsx';
import { ToasterWithDefaults } from './components/toast/toaster.tsx';
import { AuthProvider } from './context/auth/auth.tsx';
import { EmulatorContextProvider } from './context/emulator/emulator-context-provider.tsx';
import { LayoutProvider } from './context/layout/layout.tsx';
import { ModalProvider } from './context/modal/modal.tsx';
import { GbaDarkTheme } from './context/theme/theme.tsx';
import { useState } from 'react';

export const App = () => {
  const [additionalData, setAdditionalData] = useState<any>(null);
  const [gameData, setGameData] = useState(null);
  
  const defaultIP = 'https://192.168.1.3';
  const [esp32IP, setEsp32IP] = useState(defaultIP);

  return (
    <ThemeProvider theme={GbaDarkTheme}>
      <AppErrorBoundary>
        <ProductTourIntro />
        <ToasterWithDefaults />
        <AuthProvider>
          <EmulatorContextProvider>
            <LayoutProvider>
              <ModalProvider>
                <PwaPrompt />
                <NavigationMenu  additionalData={additionalData} setAdditionalData={setAdditionalData} gameData={gameData} setGameData={setGameData} esp32IP={esp32IP} setEsp32IP={setEsp32IP}/>
                <Screen />
                <ControlPanel />
                <VirtualControls  additionalData={additionalData} esp32IP={esp32IP}/>
                <ModalContainer />
              </ModalProvider>
            </LayoutProvider>
          </EmulatorContextProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  );
};
