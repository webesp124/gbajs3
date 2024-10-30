import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback } from 'react';

import { emulatorCoreCallbacksLocalStorageKey } from '../../context/emulator/consts.ts';
import { useRunningContext, useEmulatorContext } from '../context.tsx';
import { uploadSaveToCartridge } from '../../components/modals/util-rom.tsx';

export type CoreCallbackOptions = {
  saveFileSystemOnInGameSave: boolean;
  notificationsEnabled?: boolean;
};

// return a function or null based on a condition, null clears the callback in
// question, undefined allows for partial updates if desired in the future
const optionalFunc = (condition: boolean, func: () => void) =>
  condition ? func : null;

export const useAddCallbacks = () => {
  const { isRunning } = useRunningContext();
  const { emulator } = useEmulatorContext();
  const [, setFileSystemOptions] = useLocalStorage<
    CoreCallbackOptions | undefined
  >(emulatorCoreCallbacksLocalStorageKey);

  // Callback that saves the current save data with a custom name
  const saveDataUpdatedCallback = () => {
    console.log("saving main save file");
    const currentSave = emulator?.getCurrentSave?.();
    
    if (currentSave && window.currentCartridgeSaveName) {
      console.log("saving main save file 2");
      console.log(window.currentCartridgeSaveName);
      // Rename and save the current save data
      const renamedSaveFile = new File([currentSave], window.currentCartridgeSaveName);
      emulator?.uploadSaveOrSaveState?.(renamedSaveFile);
      setTimeout(function() { emulator?.fsSync?.(); }, 400);
    } else {
      console.warn("Failed to retrieve current save data or missing cartridge save name.");
    }
  };

  const addCallbacks = useCallback(
    (options: CoreCallbackOptions) =>
      emulator?.addCoreCallbacks({
        saveDataUpdatedCallback: () => {
          // Always run saveDataUpdatedCallback for saving the current data
          saveDataUpdatedCallback();
  
          // Run additional optional callback if conditions are met
          optionalFunc(
            options.saveFileSystemOnInGameSave,
            () => {
              if (window.additionalData && window.esp32IP) {
                uploadSaveToCartridge(window.additionalData, emulator, window.esp32IP);
              }
            }
          )?.();
        }
      }),
    [emulator]
  );

  const addCallbacksAndSaveSettings = useCallback(
    (options: CoreCallbackOptions) => {
      setFileSystemOptions((prevState) => ({
        ...prevState,
        ...options
      }));

      if (isRunning) addCallbacks(options);
    },
    [addCallbacks, isRunning, setFileSystemOptions]
  );

  return { addCallbacks, addCallbacksAndSaveSettings };
};
