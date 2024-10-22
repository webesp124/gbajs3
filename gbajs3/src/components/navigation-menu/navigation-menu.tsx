import { useMediaQuery } from '@mui/material';
import { useId, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  BiInfoCircle,
  BiFolderPlus,
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
  BiFileFind,
  BiGitCompare
} from 'react-icons/bi';
import { GrWifi } from "react-icons/gr";
import { MdOutlineUploadFile } from "react-icons/md";
import { IoHardwareChipOutline, IoCogSharp, IoBatteryFull } from "react-icons/io5";
import { IoIosGlobe } from "react-icons/io";

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
import { useShowLoadPublicRoms } from '../../hooks/use-show-load-public-roms.tsx';
import { AboutModal } from '../modals/about.tsx';
import { CheatsModal } from '../modals/cheats.tsx';
import { ControlsModal } from '../modals/controls.tsx';
import { DownloadSaveModal } from '../modals/download-save.tsx';
import { FileSystemModal } from '../modals/file-system.tsx';
import { SaveStatesModal } from '../modals/save-states.tsx';
import { UploadRomReflashModal } from '../modals/upload-rom-reflash.tsx';
import { ButtonBase } from '../shared/custom-button-base.tsx';

import { MyRomStartPage } from '../modals/my-rom-start-page.tsx';
import { getSaveTypeCodeFromString, uploadSaveToCartridge } from '../modals/util-rom.tsx';
import { CreatePatchFileModal } from '../modals/create-patch-file.tsx';

type ExpandableComponentProps = {
  $isExpanded?: boolean;
};

const NavigationMenuWrapper = styled.div<ExpandableComponentProps>`
  display: flex;
  flex-direction: column;
  width: ${NavigationMenuWidth}px;
  height: 100dvh;
  position: fixed;
  background-color: ${({ theme }) => theme.mediumBlack};
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  z-index: 150;
  text-align: left;
  left: 0;
  top: 0;
  touch-action: none;
  border-right: 1px solid ${({ theme }) => theme.borderBlue};

  ${({ $isExpanded = false }) =>
    !$isExpanded &&
    `left: -${NavigationMenuWidth + 5}px;
  `};
`;

const StyledMenuHeader = styled.h2`
  color: ${({ theme }) => theme.pureWhite};
  padding: 0.5rem 1rem;
  font-size: calc(1.3rem + 0.6vw);
  font-weight: 500;
  line-height: 1.2;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderBlue};

  &:hover {
    background-color: ${({ theme }) => theme.menuHighlight};
  }
`;

const MenuItemWrapper = styled.ul`
  margin-bottom: 0;
  margin-top: 0;
  list-style: none;
  padding: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  touch-action: pan-y;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HamburgerButton = styled(ButtonBase)<ExpandableComponentProps>`
  background-color: ${({ theme }) => theme.mediumBlack};
  color: ${({ theme }) => theme.pureWhite};
  z-index: 200;
  position: fixed;
  left: ${NavigationMenuWidth - 50}px;
  top: 12px;
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  cursor: pointer;
  padding: 0.05rem 0.3rem;
  border-radius: 0.35rem;
  border: none;
  min-height: 36px;
  min-width: 36px;

  ${({ $isExpanded = false }) =>
    !$isExpanded &&
    `left: 5px;
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

interface NavigationMenuProps {
  additionalData: any;
  setAdditionalData: any;
  gameData: any;
  setGameData: any;
  esp32IP: any;
  setEsp32IP: any;
}

export const NavigationMenu = ({
  additionalData,
  setAdditionalData,
  gameData,
  setGameData,
  esp32IP,
  setEsp32IP,
  }: NavigationMenuProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { setModalContent, setIsModalOpen } = useModalContext();
  const { canvas, emulator } = useEmulatorContext();
  const { isRunning } = useRunningContext();
  const theme = useTheme();
  const isLargerThanPhone = useMediaQuery(theme.isLargerThanPhone);
  const menuHeaderId = useId();
  const quickReload = useQuickReload();
  
  //const [additionalData, setAdditionalData] = useState<any>(null);
  //const [gameData, setGameData] = useState(null);
  
  //const defaultIP = 'https://192.168.1.3';
  //const [esp32IP, setEsp32IP] = useState(defaultIP);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ip = params.get('esp32_ip');
    if (ip) {
      setEsp32IP("https://" + ip);
    }

    const timer = setTimeout(() => {
      setModalContent(<MyRomStartPage additionalData={additionalData} setAdditionalData={setAdditionalData} gameData={gameData} setGameData={setGameData} esp32IP={esp32IP} setEsp32IP={setEsp32IP}/>);
      setIsModalOpen(true);
    }, 500);

    window.additionalData = additionalData;
    window.gameData = gameData;
    window.esp32IP = esp32IP;
    
    return () => clearTimeout(timer);
  }, [additionalData, gameData, esp32IP]);
  
  useShowLoadPublicRoms();

  return (
    <>
      <HamburgerButton
        id="menu-btn"
        $isExpanded={isExpanded}
        onClick={() => setIsExpanded((prevState) => !prevState)}
        aria-label="Menu Toggle"
      >
        <BiMenu style={{ height: "1.8em", width: "1.8em", verticalAlign: "middle" }} />
      </HamburgerButton>
      <NavigationMenuWrapper
        data-testid="menu-wrapper"
        id="menu-wrapper"
        $isExpanded={isExpanded}
      >
        <StyledMenuHeader id={menuHeaderId}>WifiBOY</StyledMenuHeader>
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
            title="Cartridge Actions"
            //$disabled={!isRunning}
            $isExpanded={true}
            icon={<IoHardwareChipOutline />}
          >
        
           <NavLeaf
              title="Save to Cartridge"
              $disabled={!isRunning}
              icon={<MdOutlineUploadFile />}
              onClick={() => {
                uploadSaveToCartridge(additionalData, emulator, esp32IP);
              }}
            />

            <NavLeaf
              title="Verify Cartridge Save"
              $disabled={!isRunning}
              icon={<BiGitCompare />}
              onClick={() => {
                let save = emulator?.getCurrentSave();
                const saveName = emulator?.getCurrentSaveName();

                if (save && saveName) {
                  if (save.length > 131072) {
                    // Truncate the byte array to a maximum length of 137072
                    save = save.slice(0, 131072);
                  }

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
                  
                  const uploadPromise = new Promise((resolve, reject) => {
                    xhr.open('POST', `${esp32IP}/verify_save_file?saveType=${saveType}`, true);

                    xhr.upload.onprogress = function(event) {
                      if (event.lengthComputable) {
                        const percentComplete = 67 + ((event.loaded / event.total) * 33);
                        console.log(percentComplete + "( " + event.loaded + " )");
                      } else{
                        console.log("event.lengthComputable is false")
                      }
                    };

                    xhr.onload = () => {
                      if (xhr.status >= 200 && xhr.status < 300) {
                        resolve('Verified save on cartridge'); // Resolves the promise when successful
                      } else {
                        reject('Save on cartridge is not the same.'); // Rejects the promise on failure
                      }
                    };

                    xhr.onerror = () => reject('Failed to upload save'); // Handles network errors

                    xhr.send(save);
                  });

                  // Display the toast with the promise
                  toast.promise(uploadPromise, {
                    loading: 'Verifying save on cartridge...',
                    success: (msg) => `${msg}`,
                    error: (err) => `${err}`,
                  });
                } else {
                  toast.error('Current save not available');
                }
              }}
            />

            <NavLeaf
              title="Reflash Cartridge Rom"
              icon={<BiUpload />}
              onClick={() => {
                setModalContent(<UploadRomReflashModal esp32IP={esp32IP} />);
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
        <NavComponent
          title="Other"
          icon={<BiFolderPlus />}
        >
          <NavLeaf
            title="Create Patch File"
            icon={<BiJoystick />}
            $withPadding
            onClick={() => {
              setModalContent(<CreatePatchFileModal />);
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
        </NavComponent>

        </MenuItemWrapper>
        <GrWifi style={{ color: "white", bottom: "15px", position: "absolute", fontSize: "24px", right: "15px" }}/>
        <IoIosGlobe style={{ color: "white", bottom: "15px", position: "absolute", fontSize: "24px", right: "45px" }}/>
        <IoBatteryFull style={{ color: "white", bottom: "15px", position: "absolute", fontSize: "24px", right: "75px" }}/>
        <IoCogSharp style={{ color: "white", bottom: "15px", position: "absolute", fontSize: "24px", right: "105px" }}/>
        
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
