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
import { getSaveTypeCodeFromString, timeout, fetchGameInfo } from './util-rom.tsx';

type RomLoadingIndicatorProps = {
  isLoading: boolean;
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

const RomLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
`;

const GameInfoLabel = styled.p`
  margin: 0;
  font-size: 16px;
`;

const GameInfoLabelName = styled.strong`
`;

const GameInfoLabelOption = styled.option`
`;

const GameInfoLabelSelect = styled.select`
`;

const GameInfoImage = styled.img`
  max-width: 75%;
  height: auto;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid black;
`;

const GameInfoContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
margin: 0px auto;
padding: 0px;
max-width: 600px;
`;

const ModalFooterButtonArea = styled.div`
display: flex;
gap: 10px;
width: 100%;
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

  const {
    data: externalRomFile,
    isLoading: isExternalRomLoading,
    error: externalRomLoadError,
    execute: executeLoadExternalRom,
    progress: externalRomLoadingProgress
  } = useLoadExternalRom();
  const {
    data: externalSaveFile,
    execute: executeLoadExternalSave,
  } = useLoadExternalSave();
  const runGame = useRunGame();
  const [isExternalRomInfoLoading, setIsExternalRomInfoLoading] = useState(false);

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
    }
  }, [
    shouldUploadExternalRom,
    externalRomFile,
    emulator,
    setIsModalOpen,
    runGame
  ]);

  const fetchData = async () => {
    try {
        setIsExternalRomInfoLoading(true);
        const [gameData, additionalData, checksum1000String] = await fetchGameInfo([esp32IP]);
        setGameData(gameData), setAdditionalData(additionalData), setChecksum1000String(checksum1000String);
        setIsExternalRomInfoLoading(false);
    } catch (error) {
        console.error('Error fetching game info:', error);
    }
  };
  
  useEffect(() => {
     if(externalSaveFile != null)
       emulator?.uploadSaveOrSaveState(externalSaveFile);
  }, [
    externalSaveFile,
    emulator,
  ]);
  
  useEffect(() => {
    if(!isExternalRomInfoLoading){
      fetchData();
    }
  }, []);
  
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

       await executeLoadExternalRom({ url: new URL(romURL), fullName: romName, patchFile: additionalData.patchFile });
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
          <GameInfoContainer id="game-info">
          <GameInfoImage
            id="cover-image"
            src={additionalData.coverImage.startsWith('/') ? `.${additionalData.coverImage}` : additionalData.coverImage}
            alt={`${additionalData.fullName} Cover`}
          />
          <GameInfoLabel><GameInfoLabelName>Full Name:</GameInfoLabelName> {additionalData.fullName}</GameInfoLabel>
          <GameInfoLabel><GameInfoLabelName>ROM Name:</GameInfoLabelName> {gameData.romName}</GameInfoLabel>
          
          <GameInfoLabel>
            <GameInfoLabelName>Cart Size (MB):</GameInfoLabelName>
            <GameInfoLabelSelect
              name="cartSize"
              value={additionalData.cartSize / 1024 / 1024}
              onChange={handleAdditionalDataChange}
            >
              <GameInfoLabelOption value={additionalData.cartSize} key={(additionalData.cartSize / 1024 / 1024).toFixed(2)}>
              {(additionalData.cartSize / 1024 / 1024).toFixed(2)}MB
              </GameInfoLabelOption>
      
              {[1, 2, 4, 8, 16, 32, 64].map((size) => (
                <GameInfoLabelOption key={size} value={size * 1024 * 1024}>
                  {size}MB
                </GameInfoLabelOption>
              ))}
            </GameInfoLabelSelect>
          </GameInfoLabel>
          
          <GameInfoLabel>
            <GameInfoLabelName>Save Type:</GameInfoLabelName>
            <GameInfoLabelSelect
              name="saveType"
              value={additionalData.saveType}
              onChange={handleAdditionalDataChange}
            >
              <GameInfoLabelOption value="FLASH1M_V102">FLASH1M_V102</GameInfoLabelOption>
              <GameInfoLabelOption value="FLASH1M_V103">FLASH1M_V103</GameInfoLabelOption>
              <GameInfoLabelOption value="FLASH_V124">FLASH_V124</GameInfoLabelOption>
              <GameInfoLabelOption value="FLASH_V126">FLASH_V126</GameInfoLabelOption>
              <GameInfoLabelOption value="FLASH_ECLA">FLASH_ECLA</GameInfoLabelOption>
              <GameInfoLabelOption value="EEPROM_V122">EEPROM_V122</GameInfoLabelOption>
              <GameInfoLabelOption value="EEPROM_V124">EEPROM_V124</GameInfoLabelOption>
              <GameInfoLabelOption value="SRAM_V112">SRAM_V112</GameInfoLabelOption>
              <GameInfoLabelOption value="SRAM_V113">SRAM_V113</GameInfoLabelOption>
              <GameInfoLabelOption value="REPRO_FLASH1M">REPRO_FLASH1M</GameInfoLabelOption>
              <GameInfoLabelOption value="NONE">NONE</GameInfoLabelOption>
            </GameInfoLabelSelect>
          </GameInfoLabel>
          
          <GameInfoLabel><GameInfoLabelName>Cart ID:</GameInfoLabelName> {gameData.cartID}</GameInfoLabel>
          <GameInfoLabel><GameInfoLabelName>ROM Version:</GameInfoLabelName> {gameData.romVersion}</GameInfoLabel>
          <GameInfoLabel><GameInfoLabelName>Checksum:</GameInfoLabelName> {gameData.checksumStr}</GameInfoLabel>
          <GameInfoLabel><GameInfoLabelName>Publisher:</GameInfoLabelName> {additionalData.publisher}</GameInfoLabel>
          <GameInfoLabel><GameInfoLabelName>Release Date:</GameInfoLabelName> {additionalData.releaseDate}</GameInfoLabel>
          {additionalData.patchFile != null && additionalData.patchFile.length > 0 && (
            <GameInfoLabel><GameInfoLabelName>BPS Patch File:</GameInfoLabelName> {additionalData.patchFile}</GameInfoLabel>
          )}
          
        </GameInfoContainer>
        
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
              }}
            />
            <Button
              variant="outlined"
              style={{ padding: '3px 8px 3px 8px', fontSize: '14px', marginLeft: '8px' }}
              onClick={() => {fetchData()}}
            >
              <HiRefresh style={{ fontSize: '18px' }} /> {}
              Refresh
            </Button>
          </StyledForm>
        </RomLoadingIndicator>
      </ModalBody>
      
      <ModalFooter>
        <ModalFooterButtonArea>
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
        </ModalFooterButtonArea>
      </ModalFooter>
    </>
  );
};
