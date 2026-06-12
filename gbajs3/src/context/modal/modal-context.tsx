import { createContext } from 'react';

import type { MyRomStartPageProps } from '../../components/modals/my-rom-start-page.tsx';
import type { UploadRomReflashPageProps } from '../../components/modals/upload-rom-reflash.tsx';
import type { UploadPublicExternalRomsModalProps } from '../../components/modals/upload-public-external-roms.tsx';

type ModalPayloadMap = {
  about: undefined;
  uploadFiles: undefined;
  controls: undefined;
  fileSystem: undefined;
  emulatorSettings: undefined;
  importExport: undefined;
  legal: undefined;
  login: undefined;
  downloadSave: undefined;
  saveStates: undefined;
  cheats: undefined;
  loadLocalRom: undefined;
  loadSave: undefined;
  loadRom: undefined;
  readerSetup: undefined;
  readerFirmwareUpdate: undefined;
  uploadSaveToServer: undefined;
  uploadRomToServer: undefined;
  createPatchFile: undefined;
  uploadRomReflash: UploadRomReflashPageProps;
  uploadPublicExternalRoms: UploadPublicExternalRomsModalProps;
  myRomStartPage: MyRomStartPageProps;
};

/**
 * A typed discriminated union of all possible modals and their props, if any
 */
export type ModalInput = {
  [K in keyof ModalPayloadMap]: ModalPayloadMap[K] extends undefined
    ? { type: K }
    : { type: K; props: ModalPayloadMap[K] };
}[keyof ModalPayloadMap];

export type ModalState = ModalInput | null;

type ModalContextProps = {
  modal: ModalState;
  openModal: (modal: ModalInput) => void;
  closeModal: () => void;
  clearModal: () => void;
  isModalOpen: boolean;
};

export const ModalContext = createContext<ModalContextProps | null>(null);

ModalContext.displayName = 'ModalContext';
