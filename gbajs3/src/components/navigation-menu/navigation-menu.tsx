import { useMediaQuery } from '@mui/material';
import { useId, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  BiInfoCircle,
  BiFolderPlus,
  BiCloudUpload,
  BiUpload,
  BiGame,
  BiScreenshot,
  BiFullscreen,
  BiCloudDownload,
  BiRedo,
  BiBookmarks,
  BiEdit,
  BiJoystick,
  BiMenu,
  BiFileFind
} from 'react-icons/bi';
import { MdOutlineUploadFile } from "react-icons/md";
import { styled, useTheme } from 'styled-components';

import { NavigationMenuWidth } from './consts.tsx';
import { NavComponent } from './nav-component.tsx';
import { NavLeaf } from './nav-leaf.tsx';
import {
  useEmulatorContext,
  useModalContext,
  useRunningContext
} from '../../hooks/context.tsx';
import { useQuickReload } from '../../hooks/emulator/use-quick-reload.tsx';
import { AboutModal } from '../modals/about.tsx';
import { CheatsModal } from '../modals/cheats.tsx';
import { ControlsModal } from '../modals/controls.tsx';
import { DownloadSaveModal } from '../modals/download-save.tsx';
import { FileSystemModal } from '../modals/file-system.tsx';
import { LoadLocalRomModal } from '../modals/load-local-rom.tsx';
import { SaveStatesModal } from '../modals/save-states.tsx';
import { UploadCheatsModal } from '../modals/upload-cheats.tsx';
import { UploadRomModal } from '../modals/upload-rom.tsx';
import { UploadSavesModal } from '../modals/upload-saves.tsx';
import { ButtonBase } from '../shared/custom-button-base.tsx';

import { MyRomStartPage } from '../modals/my-rom-start-page.tsx';
import { getSaveTypeCodeFromString } from '../modals/util-rom.tsx';

type ExpandableComponentProps = {
  $isExpanded?: boolean;
};

const NavigationMenuWrapper = styled.div<ExpandableComponentProps>`
  width: ${NavigationMenuWidth}px;
  height: 100dvh;
  position: fixed;
  background-color: ${({ theme }) => theme.mediumBlack};
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  z-index: 150;
  overflow-y: auto;
  text-align: left;
  left: 0;
  top: 0;
  touch-action: none;

  ${({ $isExpanded = false }) =>
    !$isExpanded &&
    `left: -${NavigationMenuWidth + 5}px;
    `}

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledMenuHeader = styled.h2`
  color: ${({ theme }) => theme.pureWhite};
  padding: 0.5rem 1rem;
  font-size: calc(1.3rem + 0.6vw);
  font-weight: 500;
  line-height: 1.2;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.menuHighlight};
  }
`;

const MenuItemWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  margin-top: 0;
  list-style: none;
  padding: 0;
`;

const HamburgerButton = styled(ButtonBase)<ExpandableComponentProps>`
  background-color: ${({ theme }) => theme.mediumBlack};
  color: ${({ theme }) => theme.pureWhite};
  z-index: 200;
  position: fixed;
  left: ${NavigationMenuWidth - 6}px;
  top: 12px;
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  min-height: 36px;
  min-width: 40px;

  ${({ $isExpanded = false }) =>
    !$isExpanded &&
    `left: -8px;
    `}

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`;

const NavigationMenuClearDismiss = styled.button`
  position: absolute;
  width: calc(100dvw - ${NavigationMenuWidth}px);
  left: ${NavigationMenuWidth}px;
  height: 99%;
  background: 0 0;
  z-index: 140;
  border: none;
`;

export const NavigationMenu = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { setModalContent, setIsModalOpen } = useModalContext();
  const { canvas, emulator } = useEmulatorContext();
  const { isRunning } = useRunningContext();
  const theme = useTheme();
  const isLargerThanPhone = useMediaQuery(theme.isLargerThanPhone);
  const menuHeaderId = useId();
  const quickReload = useQuickReload();
  
  const [additionalData, setAdditionalData] = useState<any>(null);
  const [gameData, setGameData] = useState(null);
  
  const defaultIP = 'https://192.168.1.3';
  const [esp32IP, setEsp32IP] = useState(defaultIP);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ip = params.get('esp32_ip');
    if (ip) {
      setEsp32IP(ip);
    }

    const timer = setTimeout(() => {
      console.log("run12");

      setModalContent(<MyRomStartPage additionalData={additionalData} setAdditionalData={setAdditionalData} gameData={gameData} setGameData={setGameData} esp32IP={esp32IP} setEsp32IP={setEsp32IP}/>);
      setIsModalOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [additionalData, gameData, esp32IP]);
  
  return (
    <>
      <HamburgerButton
        id="menu-btn"
        $isExpanded={isExpanded}
        onClick={() => setIsExpanded((prevState) => !prevState)}
        aria-label="Menu Toggle"
      >
        <BiMenu />
      </HamburgerButton>
      <NavigationMenuWrapper
        data-testid="menu-wrapper"
        id="menu-wrapper"
        $isExpanded={isExpanded}
      >
        <StyledMenuHeader id={menuHeaderId}>Menu</StyledMenuHeader>
        <MenuItemWrapper aria-labelledby={menuHeaderId}>
          <NavLeaf
            title="My Cartridge"
            icon={<BiJoystick />}
            $withPadding
            onClick={() => {
              setModalContent(<MyRomStartPage additionalData={additionalData} setAdditionalData={setAdditionalData} gameData={gameData} setGameData={setGameData} esp32IP={esp32IP} setEsp32IP={setEsp32IP}/>);
              setIsModalOpen(true);
            }}
          />

          <NavComponent
            title="Pre Game Actions"
            $disabled={isRunning}
            $isExpanded={!isRunning}
            icon={<BiFolderPlus />}
          >
            <NavLeaf
              title="Upload Saves"
              $disabled={isRunning}
              icon={<BiCloudUpload />}
              onClick={() => {
                setModalContent(<UploadSavesModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Upload Cheats"
              $disabled={isRunning}
              icon={<BiCloudUpload />}
              onClick={() => {
                setModalContent(<UploadCheatsModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Upload Rom"
              $disabled={isRunning}
              icon={<BiUpload />}
              onClick={() => {
                setModalContent(<UploadRomModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Load Local Rom"
              $disabled={isRunning}
              icon={<BiUpload />}
              onClick={() => {
                setModalContent(<LoadLocalRomModal />);
                setIsModalOpen(true);
              }}
            />
          </NavComponent>

          <NavComponent
            title="In Game Actions"
            $disabled={!isRunning}
            $isExpanded={isRunning}
            icon={<BiGame />}
          >
        
           <NavLeaf
              title="Save to Cartridge"
              $disabled={!isRunning}
              icon={<MdOutlineUploadFile />}
              onClick={() => {
            const save = emulator?.getCurrentSave();
            const saveName = emulator?.getCurrentSaveName();

            if (save && saveName) {
              const xhr = new XMLHttpRequest();
              
              if(!additionalData){
                 console.log("No save type information.");
                 return;
              }
              
              var saveType = getSaveTypeCodeFromString(additionalData.saveType);
              if (saveType == -1) {
                 console.log("Invalid Save Type");
                 return;
              }
              console.log(saveType);
              
              const uploadPromise = new Promise((resolve, reject) => {
                 xhr.open('POST', `${esp32IP}/upload_save_file?saveType=${saveType}`, true);

                 xhr.onload = () => {
                   if (xhr.status >= 200 && xhr.status < 300) {
                     resolve('Uploaded save to cartridge'); // Resolves the promise when successful
                   } else {
                     reject('Failed to upload save to cartridge'); // Rejects the promise on failure
                   }
                 };

                 xhr.onerror = () => reject('Failed to upload save to cartridge'); // Handles network errors

                 xhr.send(save);
               });

               // Display the toast with the promise
               toast.promise(uploadPromise, {
                 loading: 'Uploading save to cartridge...',
                 success: (msg) => `${msg}`,
                 error: (err) => `${err}`,
               });
            } else {
              toast.error('Current save not available');
            }
          }}
            />
            
            <NavLeaf
              title="Screenshot"
              $disabled={!isRunning}
              icon={<BiScreenshot />}
              onClick={() => {
                if (emulator?.screenshot())
                  toast.success('Screenshot saved successfully');
                else toast.error('Screenshot has failed');
              }}
            />
            <NavLeaf
              title="Full Screen"
              $disabled={!isRunning}
              icon={<BiFullscreen />}
              onClick={() => {
                canvas?.requestFullscreen().catch(() => {
                  toast.error('Full screen request has failed');
                });
              }}
            />
            <NavLeaf
              title="Download Save"
              $disabled={!isRunning}
              icon={<BiCloudDownload />}
              onClick={() => {
                setModalContent(<DownloadSaveModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Quick Reload"
              $disabled={!isRunning}
              icon={<BiRedo />}
              onClick={quickReload}
            />
            <NavLeaf
              title="Manage Save States"
              $disabled={!isRunning}
              icon={<BiBookmarks />}
              onClick={() => {
                setModalContent(<SaveStatesModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Manage Cheats"
              $disabled={!isRunning}
              icon={<BiEdit />}
              onClick={() => {
                setModalContent(<CheatsModal />);
                setIsModalOpen(true);
              }}
            />
          </NavComponent>

          <NavLeaf
            title="Controls"
            icon={<BiJoystick />}
            $withPadding
            onClick={() => {
              setModalContent(<ControlsModal />);
              setIsModalOpen(true);
            }}
          />

          <NavLeaf
            title="File System"
            icon={<BiFileFind />}
            $withPadding
            onClick={() => {
              setModalContent(<FileSystemModal />);
              setIsModalOpen(true);
            }}
          />

          <NavLeaf
            title="About"
            icon={<BiInfoCircle />}
            $withPadding
            onClick={() => {
              setModalContent(<AboutModal />);
              setIsModalOpen(true);
            }}
          />

        </MenuItemWrapper>
      </NavigationMenuWrapper>
      {isExpanded && !isLargerThanPhone && (
        <NavigationMenuClearDismiss
          aria-label="Menu Dismiss"
          onClick={() => {
            setIsExpanded(false);
          }}
        />
      )}
    </>
  );
};
