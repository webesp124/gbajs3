import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useId } from 'react';
import toast from 'react-hot-toast';

import { emulatorSettingsLocalStorageKey } from '../../context/emulator/consts.ts';
import { uploadSaveToCartridge } from '../../components/modals/util-rom.tsx';
import { useEmulatorContext } from '../context.tsx';
import { useFileStat } from './use-file-stat.tsx';

import type { EmulatorSettings } from '../../components/modals/emulator-settings.tsx';

export type CoreCallbackOptions = {
  saveFileSystemOnInGameSave: boolean;
  autoUploadSaveToCartridge?: boolean;
  autoSaveStateLoadNotificationEnabled: boolean;
  autoSaveStateCaptureNotificationEnabled: boolean;
  fileSystemNotificationsEnabled: boolean;
};

type SyncActionIfEnabledProps = {
  withToast?: boolean;
};

// return a function or null based on a condition, null clears the callback in
// question, undefined allows for partial updates if desired in the future
const optionalFunc = (condition: boolean, func: () => void) =>
  condition ? func : null;

export const useAddCallbacks = () => {
  const { emulator } = useEmulatorContext();
  const [emulatorSettings] = useLocalStorage<EmulatorSettings | undefined>(
    emulatorSettingsLocalStorageKey
  );
  const autoSaveStatePath = emulator?.getCurrentAutoSaveStatePath();
  const { trigger } = useFileStat(autoSaveStatePath);
  const savedFileSystemToastId = useId();
  const autoSaveStateLoadedToastId = useId();
  const autoSaveStateCapturedToastId = useId();

  const syncActionIfEnabled = useCallback(
    async ({ withToast = true }: SyncActionIfEnabledProps = {}) => {
      if (emulatorSettings?.saveFileSystemOnCreateUpdateDelete) {
        await emulator?.fsSync();
        if (emulatorSettings.fileSystemNotificationsEnabled && withToast)
          toast.success('Saved File System', { id: savedFileSystemToastId });
      }
    },
    [
      emulatorSettings?.saveFileSystemOnCreateUpdateDelete,
      emulatorSettings?.fileSystemNotificationsEnabled,
      emulator,
      savedFileSystemToastId
    ]
  );

  const addCallbacks = useCallback(
    (options: CoreCallbackOptions) =>
      emulator?.addCoreCallbacks({
        saveDataUpdatedCallback: optionalFunc(
          options.saveFileSystemOnInGameSave,
          async () => {
            await emulator.fsSync();
            if (options.fileSystemNotificationsEnabled)
              toast.success('Saved File System', {
                id: savedFileSystemToastId
              });
            if (
              options.autoUploadSaveToCartridge !== false &&
              window.additionalData &&
              window.esp32IP
            ) {
              await uploadSaveToCartridge(
                window.additionalData,
                emulator,
                window.esp32IP,
                {
                  confirm: false,
                  backup: false,
                  toastId: 'cartridge-save-auto-upload',
                  loadingMessage: 'Uploading in-game save to cartridge...',
                  successMessage: 'Uploaded in-game save to cartridge'
                }
              );
            }
          }
        ),
        autoSaveStateLoadedCallback: optionalFunc(
          options.autoSaveStateLoadNotificationEnabled,
          () =>
            toast.success('Auto save state loaded', {
              id: autoSaveStateLoadedToastId
            })
        ),
        autoSaveStateCapturedCallback: optionalFunc(
          options.autoSaveStateCaptureNotificationEnabled,
          () => {
            toast.success('Auto save state captured', {
              id: autoSaveStateCapturedToastId
            });
            trigger();
          }
        )
      }),
    [
      autoSaveStateCapturedToastId,
      autoSaveStateLoadedToastId,
      emulator,
      savedFileSystemToastId,
      trigger
    ]
  );

  return {
    addCallbacks,
    syncActionIfEnabled
  };
};
