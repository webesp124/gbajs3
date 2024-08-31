import { Button, Divider, TextField } from '@mui/material';
import { useEffect, useState, type ReactNode } from 'react';
import { BiError } from 'react-icons/bi';
import { PacmanLoader } from 'react-spinners';
import { styled, useTheme } from 'styled-components';
import { BiPlay } from 'react-icons/bi';
import { IoRocketSharp } from "react-icons/io5";
import { HiRefresh } from "react-icons/hi";

import { ModalBody } from './modal-body.tsx';
import { ModalFooter } from './modal-footer.tsx';
import { ModalHeader } from './modal-header.tsx';
import { useEmulatorContext, useModalContext } from '../../hooks/context.tsx';
import { useRunGame } from '../../hooks/emulator/use-run-game.tsx';
import { useLoadExternalRom } from '../../hooks/use-load-my-external-rom.tsx';
import { ErrorWithIcon } from '../shared/error-with-icon.tsx';
import { useLoadExternalSave } from '../../hooks/use-load-my-save.tsx';

type RomLoadingIndicatorProps = {
  isLoading: boolean;
  //currentRomURL: string | null;
  children: ReactNode;
  indicator: ReactNode;
  progress: number;
};

type MyRomStartPageProps = {
  additionalData: any;
  setAdditionalData: (data: any) => void;
  gameData: any;
  setGameData: (data: any) => void;
  esp32IP: string;
  setEsp32IP: (data: string) => void;
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100dvw;
  max-width: fill-available;
  max-width: stretch;
  max-width: -webkit-fill-available;
  max-width: -moz-available;
`;

export function getSaveTypeCodeFromString(saveTypeString: string[]){
      console.log(saveTypeString);
      
      if (saveTypeString[0] == 'N') {
        return 0;
      } else if (saveTypeString[0] == 'E') {
        return 1;
      } else if (saveTypeString[0] == 'S') {
        return 3;
      } else if ((saveTypeString[0] == 'F') && (saveTypeString[5] == '1')) {
        return 5;
      } else if (saveTypeString[0] == 'F') {
        return 4;
      } else if ((saveTypeString[0] == 'R') && (saveTypeString[11] == '1')) {
        return 55;
      } else{
        console.log("Invalid Save Type");
        return -1;
      }
  }

const RomLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
`;

const URLDisplay = styled.p`
  word-wrap: break-word;
  max-width: 100%;
`;

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  height: 24px;
  width: 100%;
  margin-top: 16px;
  overflow: hidden;

  &::after {
    content: '';
    background-color: ${props => props.theme.gbaThemeBlue};
    height: 100%;
    width: ${props => props.progress}%;
    position: absolute;
    left: 0;
    top: 0;
    transition: width 0.2s ease-in-out;
  }
`;

const RomLoadingIndicator = ({
  isLoading,
  //currentRomURL,
  children,
  indicator,
  progress
}: RomLoadingIndicatorProps) => {
  return isLoading ? (
    <RomLoadingContainer>
      <URLDisplay>
        Dumping Rom from cartridge...
      </URLDisplay>
      {indicator}
      <ProgressBar progress={progress}>
          <span style={{ position: 'relative', width: '100%', textAlign: 'center', zIndex: 600 }}>
            {Math.round(progress)}%
          </span>
        </ProgressBar>
    </RomLoadingContainer>
  ) : (
    children
  );
};

export const MyRomStartPage: React.FC<MyRomStartPageProps> = ({
  additionalData,
  setAdditionalData,
  gameData,
  setGameData,
  esp32IP,
  setEsp32IP,
  }) => {
  
  const theme = useTheme();
  const { setIsModalOpen } = useModalContext();
  const { emulator } = useEmulatorContext();
  //const [currentRomURL, setCurrentRomURL] = useState<string | null>(null);

  const {
    data: externalRomFile,
    isLoading: isExternalRomLoading,
    error: externalRomLoadError,
    execute: executeLoadExternalRom,
    progress: externalRomLoadingProgress
  } = useLoadExternalRom();
  const {
    data: externalSaveFile,
    //isLoading: isExternalSaveLoading,
    //error: externalSaveLoadError,
    execute: executeLoadExternalSave,
    //progress: externalSaveLoadingProgress
  } = useLoadExternalSave();
  const runGame = useRunGame();
  const [isExternalRomInfoLoading, setIsExternalRomInfoLoading] = useState(false);
  //const [externalRomInfoLoadError, setExternalRomInfoLoadError] = useState(null);

  const shouldUploadExternalRom =
    !isExternalRomLoading && !!externalRomFile;
    
  const [checksum1000String, setChecksum1000String] = useState<string | null>(null);
  
  const handleAdditionalDataChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setAdditionalData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (shouldUploadExternalRom) {
      const runCallback = () => {
        const hasSucceeded = runGame(
          emulator?.filePaths().gamePath + '/' + externalRomFile.name
        );
        if (hasSucceeded) {
          setIsModalOpen(false);
        }
      };
      emulator?.uploadRom(externalRomFile, runCallback);
      //setCurrentRomURL(null);
    }
  }, [
    shouldUploadExternalRom,
    externalRomFile,
    emulator,
    setIsModalOpen,
    runGame
  ]);
  
  useEffect(() => {
     if(externalSaveFile != null)
       emulator?.uploadSaveOrSaveState(externalSaveFile);
  }, [
    externalSaveFile,
    emulator,
  ]);
  
  useEffect(() => {
    if(!isExternalRomInfoLoading){
      fetchGameInfo();
    }
  }, []);
  
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }
  
  const getChecksum1000 = (gameData: { checksum_1MB: string; checksum_2MB: string; checksum_4MB: string; checksum_8MB: string; checksum_16MB: string; }, additionalData: { cartSize: number; }) => {
      let cartSizeMB = Number(additionalData.cartSize /1024/1024);
      
      let checksum1000 = "";
      if(cartSizeMB == 1)
        checksum1000 = gameData.checksum_1MB;
      else if(cartSizeMB == 2)
        checksum1000 = gameData.checksum_2MB;
      else if(cartSizeMB == 4)
        checksum1000 = gameData.checksum_4MB;
      else if(cartSizeMB == 8)
        checksum1000 = gameData.checksum_8MB;
      else if(cartSizeMB == 16)
        checksum1000 = gameData.checksum_16MB;
      
      return checksum1000.toUpperCase();
  }
  
  const buildRomName = () => {
     return additionalData.fullName + "_" + gameData.cartID + "_" + checksum1000String;
  };

  const startGameWithSave = async () => {
    let saveName = buildRomName() + ".sav";
    await fetchMySave(additionalData.saveType, saveName);
    await timeout(300);
    console.log("save loaded");
    await startGameWithoutSave();
  };
  
  // Function to try to start a locally existing rom file
  const startGameLocally = async (romName: string) => {
    let localRoms = emulator?.listRoms?.();
    console.log(localRoms);
    if(localRoms && localRoms.includes(romName)){
      console.log("rom exists locally");
      runGame(emulator?.filePaths().gamePath + '/' + romName);
      setIsModalOpen(false);
      return true;
    }
    return false;
  };

  // Function to start game without save
  const startGameWithoutSave = async () => {
    let romName = buildRomName() + ".gba";
    let startedGameWithLocalFile = await startGameLocally(romName);
    if (!startedGameWithLocalFile){
       let cartSizeBytes = additionalData.cartSize;
       let romURL = `${esp32IP}/get_current_game.gba?cartSize=${cartSizeBytes}&saveType=4`;

       //setCurrentRomURL(romURL);
       await executeLoadExternalRom({ url: new URL(romURL), fullName: romName, patchFile: additionalData.patchFile });
    }
  };
  
  // Function to fetch and display game information
  const fetchGameInfo = async () => {
    try {
      setIsExternalRomInfoLoading(true);

      // Fetch the basic game info
      const response = await fetch(`${esp32IP}/get_game_info`, {
        method: 'GET',
        headers: {
          'Access-Control-Request-Private-Network': 'true',
        }
      });

      const gameData = await response.json();
      setGameData(gameData);

      // Fetch additional information using the cartID
      const additionalResponse = await fetch(`./information_rom/${gameData.cartID}.json`);
      let additionalData = await additionalResponse.json();
      
      console.log(32332);
      let checksum1000 = getChecksum1000(gameData, additionalData);
      setChecksum1000String(checksum1000);
      
      if(checksum1000 != additionalData.checksum1000){
        console.log("Checksums do not match. Trying to get a different one...");
        
        try {
          const additionalResponseAdd = await fetch(`./information_rom/${checksum1000}-${gameData.cartID}.json`);

          // Check if the response is successful
          if (!additionalResponseAdd.ok  || additionalResponseAdd.status != 200) {
              throw new Error(`HTTP error! Status: ${additionalResponseAdd.status}`);
          }

          let additionalDataAdd = await additionalResponseAdd.json();

          // Check if additionalDataAdd is not empty or undefined
          if (additionalDataAdd && Object.keys(additionalDataAdd).length > 0) {
              console.log("Data exists");
              additionalData = additionalDataAdd;
          } else {
              console.log("Data does not exist or is empty");
          }
        } catch (error) {
          console.error("An error occurred while fetching other additional data:", error);
        }
      }
      
      setAdditionalData(additionalData);
    } catch (error) {
      console.error('Error fetching game information:', error);
      //setExternalRomInfoLoadError('Failed to load game information');
    } finally {
      setIsExternalRomInfoLoading(false);
    }
  };
  
  // Function to fetch the save
  const fetchMySave = async (saveTypeString: string[], fullName: string) => {
    try {
      console.log(saveTypeString);
      var saveType = getSaveTypeCodeFromString(saveTypeString);
      if (saveType == -1) {
        console.log("Invalid Save Type");
        return;
      }
      console.log(saveType);
      
      var saveURL = `${esp32IP}/get_current_save?saveType=${saveType}`;
      await executeLoadExternalSave({ url: new URL(saveURL), fullName: fullName });

    } catch (error) {
      console.error('Error fetching save:', error);
    } finally {
    }
  };

  return (
    <>
      {gameData && additionalData ? (
      <ModalHeader title={additionalData.fullName} />
      ) : gameData && !additionalData ? (
      <ModalHeader title={gameData.romName} />
      ) : !gameData && additionalData ? (
      <ModalHeader title={additionalData.fullName} />
      ) : (
      <ModalHeader title="No Response from Cart Reader" />
      )}
      <ModalBody>
        <RomLoadingIndicator
          isLoading={isExternalRomLoading}
          indicator={
            <PacmanLoader
              color={theme.gbaThemeBlue}
              cssOverride={{ margin: '0 auto' }}
            />
          }
          progress={externalRomLoadingProgress}
        >

            {!!externalRomLoadError && (
              <ErrorWithIcon
                icon={<BiError style={{ color: theme.errorRed }} />}
                text="Loading rom from URL has failed"
              />
            )}

          {gameData && additionalData && (
          <div
            id="game-info"
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: '0px auto',
            padding: '0px',
            maxWidth: '600px',
            }}
          >
          <img
            id="cover-image"
            src={additionalData.coverImage}
            alt={`${additionalData.fullName} Cover`}
            style={{
            maxWidth: '75%',
            height: 'auto',
            marginBottom: '15px',
            borderRadius: '12px',
            border: '1px solid black',
            }}
          />
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>Full Name:</strong> {additionalData.fullName}</p>
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>ROM Name:</strong> {gameData.romName}</p>
          
          <label>
          <strong>Cart Size (MB):</strong>
          <select
            name="cartSize"
            value={additionalData.cartSize / 1024 / 1024}
            onChange={handleAdditionalDataChange}
          >
            <option value={additionalData.cartSize} hidden>
            {(additionalData.cartSize / 1024 / 1024).toFixed(2)}MB
            </option>
    
            <option value={1*1024*1024}>1MB</option>
            <option value={2*1024*1024}>2MB</option>
            <option value={4*1024*1024}>4MB</option>
            <option value={8*1024*1024}>8MB</option>
            <option value={16*1024*1024}>16MB</option>
            <option value={32*1024*1024}>32MB</option>
            <option value={64*1024*1024}>64MB</option>
          </select>
          </label>
          
          <label>
          <strong>Save Type:</strong>
          <select
            name="saveType"
            value={additionalData.saveType}
            onChange={handleAdditionalDataChange}
          >
            <option value="FLASH1M_V102">FLASH1M_V102</option>
            <option value="FLASH1M_V103">FLASH1M_V103</option>
            <option value="FLASH_V124">FLASH_V124</option>
            <option value="FLASH_V126">FLASH_V126</option>
            <option value="FLASH_ECLA">FLASH_ECLA</option>
            <option value="EEPROM_V122">EEPROM_V122</option>
            <option value="EEPROM_V124">EEPROM_V124</option>
            <option value="SRAM_V112">SRAM_V112</option>
            <option value="SRAM_V113">SRAM_V113</option>
            <option value="REPRO_FLASH1M">REPRO_FLASH1M</option>
            <option value="NONE">NONE</option>
          </select>
          </label>
          
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>Cart ID:</strong> {gameData.cartID}</p>
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>ROM Version:</strong> {gameData.romVersion}</p>
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>Checksum:</strong> {gameData.checksumStr}</p>
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>Publisher:</strong> {additionalData.publisher}</p>
          <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>Release Date:</strong> {additionalData.releaseDate}</p>
          {additionalData.patchFile != null && additionalData.patchFile.length > 0 && (
            <p style={{ margin: '3px 0', fontSize: '16px' }}><strong>BPS Patch File:</strong> {additionalData.patchFile}</p>
          )}
          
        </div>
        
        )}

{gameData && additionalData && (
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Cart Reader</Divider>
        )}
        
        <StyledForm
            aria-label="Login Form"
          >
            <TextField
              label="ESP32 IP Address"
              autoComplete="esp32IPInputField"
              variant="filled"
              style={{ padding: '3px 8px 3px 8px', fontSize: '14px', marginLeft: '5px' }}
              defaultValue={esp32IP}
              onChange={(event) => {
                setEsp32IP(event.target.value);
                console.log(event.target.value);
              }}
            />
            <Button
              variant="outlined"
              style={{ padding: '3px 8px 3px 8px', fontSize: '14px', marginLeft: '8px' }}
              onClick={() => {fetchGameInfo()}}
            >
              <HiRefresh style={{ fontSize: '18px' }} /> {/* Icon for "Start Game" */}
              Refresh
            </Button>
          </StyledForm>
        
        
          
         
        </RomLoadingIndicator>
      </ModalBody>
      
      
      <ModalFooter

>
  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
    <Button
      variant="contained"
      color="primary"
      style={{ padding: '10px 20px 10px 10px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
      onClick={() => startGameWithSave()}
    >
      <IoRocketSharp style={{ fontSize: '30px', marginRight: '10px' }} /> {/* Icon for "Start Game With Save" */}
      Start Game<br/>With Save
    </Button>
    <Button
      variant="outlined"
      color="primary"
      style={{ padding: '10px 20px 10px 10px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
      onClick={() => startGameWithoutSave()}
    >
      <BiPlay style={{ fontSize: '40px' }} /> {/* Icon for "Start Game" */}
      Start Game
    </Button>
    <Button
      variant="outlined"
      style={{ padding: '10px 20px 10px 20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
      onClick={() => setIsModalOpen(false)}
    >
      Close
    </Button>
  </div>
</ModalFooter>


    </>
  );
};
