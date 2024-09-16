import { Table, TableBody, TableCell, TableContainer, TableRow, Button, Divider, TextField, Select, MenuItem } from '@mui/material';
import { useEffect, useState, type ReactNode } from 'react';
import { BiError } from 'react-icons/bi';
import { PacmanLoader } from 'react-spinners';
import { styled, useTheme } from 'styled-components';
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
import { getSaveTypeCodeFromString, timeout, fetchGameInfo, saveTypes } from './util-rom.tsx';
import { SaveSelectionTable } from './save-selection-table.tsx';
import { GameSelectionTable } from './game-selection-table.tsx';

type RomLoadingIndicatorProps = {
  isLoading: boolean;
  isExternalRomLoading: boolean;
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

const ModalFooterButtonArea = styled.div`
display: flex;
gap: 10px;
width: 100%;
flex-direction: column;
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
  isExternalRomLoading,
  children,
  indicator,
  progress
}: RomLoadingIndicatorProps) => {
  return isLoading ? (
    <RomLoadingContainer>
      {isExternalRomLoading && (
      <URLDisplay>
        Dumping Rom from cartridge...
      </URLDisplay>
      )}
      {!isExternalRomLoading && (
      <URLDisplay>
        Dumping Save from cartridge...
      </URLDisplay>
      )}
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
  const [isLoading, setIsLoading] = useState(false);

  const shouldUploadExternalRom =
    !isExternalRomLoading && !!externalRomFile;
    
  const [checksum1000String, setChecksum1000String] = useState<string | null>(null);
  const [selectedSave, setSelectedSave] = useState("Cartridge Save");
  const [selectedGame, setSelectedGame] = useState("Cartridge Rom");
  
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
     if (additionalData)
       return additionalData.fullName + "_" + gameData.cartID + "_" + checksum1000String;
     else
       return gameData.romName + "_" + gameData.cartID + "_" + checksum1000String;
  };

  const startGameWithSave = async () => {
    setIsLoading(true);
    if (gameData["is_gba"]){
      console.log("Using save: " + selectedSave);
      let saveName = buildRomName() + ".sav";
      if (selectedSave == "Cartridge Save")
        await fetchMySave(additionalData.saveType, saveName);
      //else
      //  emulator?.uploadSaveOrSaveState(emulator?.getFile("/data/saves/" + selectedSave));
      await timeout(300);
      console.log("save loaded");
    }
    await startGameWithoutSave();
    setIsLoading(false);
  };
  
  // Function to try to start a locally existing rom file
  const startGameLocally = async (romName: string) => {
    let localRoms = emulator?.listRoms?.();
    console.log(localRoms);
    if(localRoms && localRoms.includes(romName)){
      console.log("rom exists locally");
      runGame(emulator?.filePaths().gamePath + '/' + romName);
      setIsModalOpen(false);
      setIsLoading(false);
      return true;
    }
    return false;
  };

  // Function to start game without save
  const startGameWithoutSave = async () => {
    setIsLoading(true);
    if (selectedGame != "Cartridge Rom"){
       let startedGameWithLocalFile = await startGameLocally(selectedGame);
       if (!startedGameWithLocalFile) {
         console.log("Unable to load local rom");
       }
    }
    else{
       if (gameData["is_gba"]){
        let romName = buildRomName() + ".gba";
        let cartSizeBytes = additionalData.cartSize;
        let romURL = `${esp32IP}/get_current_game.gba?cartSize=${cartSizeBytes}&saveType=4`;

        await executeLoadExternalRom({ url: new URL(romURL), fullName: romName, patchFile: additionalData.patchFile });
       }
       else {
        let romName = buildRomName() + ".gb";
        let romURL = `${esp32IP}/get_current_game.gb`;

        await executeLoadExternalRom({ url: new URL(romURL), fullName: romName, patchFile: null });
       }
    }
    setIsLoading(false);
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
          isLoading={isLoading}
          isExternalRomLoading={isExternalRomLoading}
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
          {gameData && gameData.is_gba && (
            <>
          {gameData && additionalData && (
            <>
          <RomLoadingContainer>
            <GameInfoImage
              id="cover-image"
              src={additionalData.coverImage ? additionalData.coverImage.startsWith('/') ? `.${additionalData.coverImage}` : additionalData.coverImage : ""}
              alt={`${additionalData.fullName} Cover`}
            />
          </RomLoadingContainer>
          <TableContainer id="game-info"><Table><TableBody>
            <TableRow><TableCell>Full Name:</TableCell><TableCell>{additionalData.fullName}</TableCell></TableRow>
            <TableRow><TableCell>ROM Name:</TableCell><TableCell>{gameData.romName}</TableCell></TableRow>
            
            <TableRow>
              <TableCell>Cart Size:</TableCell>
              <TableCell><Select
                name="cartSize"
                value={additionalData.cartSize}
                onChange={handleAdditionalDataChange}
              >
                <MenuItem value={additionalData.cartSize} key={(additionalData.cartSize / 1024 / 1024).toFixed(2)}>
                {(additionalData.cartSize / 1024 / 1024).toFixed(2)}MB
                </MenuItem>
        
                {[1, 2, 4, 8, 16, 32, 64].map((size) => (
                  <MenuItem key={size} value={size * 1024 * 1024}>
                    {size}MB
                  </MenuItem>
                ))}
              </Select></TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>Save Type:</TableCell>
              <TableCell><Select
                name="saveType"
                value={additionalData.saveType}
                onChange={handleAdditionalDataChange}
              >
                {saveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select></TableCell>
            </TableRow>
            
            {additionalData.patchFile != null && additionalData.patchFile.length > 0 && (
              <TableRow><TableCell>BPS Patch File:</TableCell> <TableCell>{additionalData.patchFile}</TableCell></TableRow>
            )}

            <TableRow><TableCell>Cart ID:</TableCell> <TableCell>{gameData.cartID}</TableCell></TableRow>
            <TableRow><TableCell>ROM Version:</TableCell> <TableCell>{gameData.romVersion}</TableCell></TableRow>
            <TableRow><TableCell>Checksum:</TableCell> <TableCell>0x{checksum1000String}</TableCell></TableRow>
            <TableRow><TableCell>Publisher:</TableCell> <TableCell>{additionalData.publisher}</TableCell></TableRow>
            <TableRow><TableCell style={{border:"none"}}>Release Date:</TableCell> <TableCell style={{border:"none"}}>{additionalData.releaseDate}</TableCell></TableRow>
          
          </TableBody></Table></TableContainer>
        
        {emulator && (
          <>
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Local Saves</Divider>
            <SaveSelectionTable gameData={gameData} checksum1000String={checksum1000String} selectedSave={selectedSave} setSelectedSave={setSelectedSave} saveName={buildRomName() + ".sav"} />
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Local Roms</Divider>
            <GameSelectionTable gameData={gameData} checksum1000String={checksum1000String} selectedGame={selectedGame} setSelectedGame={setSelectedGame} romName={buildRomName() + ".gba"} />
            </>
          )}
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Cart Reader</Divider>

        </>
        )}
        </>
        )}



        {gameData && !gameData.is_gba && (
          <>
          {gameData && (
            <>
            <GameInfoLabel><GameInfoLabelName>ROM Name:</GameInfoLabelName> {gameData.romName}</GameInfoLabel>
            <GameInfoLabel>
            <GameInfoLabelName>Cart Size (KB):</GameInfoLabelName>
            <GameInfoLabelSelect
              name="cartSize"
              value={gameData.romSizeBytes_gb / 1024}
              onChange={handleAdditionalDataChange}
            >
              <GameInfoLabelOption value={gameData.romSizeBytes_gb} key={(gameData.romSizeBytes_gb / 1024).toFixed(2)}>
              {(gameData.romSizeBytes_gb / 1024).toFixed(2)}MB
              </GameInfoLabelOption>
      
              {[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192].map((size) => (
                <GameInfoLabelOption key={size} value={size * 1024}>
                  {size}KB
                </GameInfoLabelOption>
              ))}
            </GameInfoLabelSelect>
            </GameInfoLabel>
            <GameInfoLabel><GameInfoLabelName>Rom Banks:</GameInfoLabelName> {gameData.romBanks}</GameInfoLabel>
            <GameInfoLabel><GameInfoLabelName>Checksum:</GameInfoLabelName> 0x{gameData.checksum_gb}</GameInfoLabel>
            <GameInfoLabel><GameInfoLabelName>SRAM Size:</GameInfoLabelName> {gameData.sramSize}</GameInfoLabel>
            <GameInfoLabel><GameInfoLabelName>Audio WE used:</GameInfoLabelName> {gameData.audioWE ? "true" : "false"}</GameInfoLabel>

            {emulator && (
              <>
            <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Local Saves</Divider>
                <SaveSelectionTable gameData={gameData} checksum1000String={checksum1000String} selectedSave={selectedSave} setSelectedSave={setSelectedSave} saveName={buildRomName() + ".sav"} />
            <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Local Roms</Divider>
                <GameSelectionTable gameData={gameData} checksum1000String={checksum1000String} selectedGame={selectedGame} setSelectedGame={setSelectedGame} romName={buildRomName() + ".gba"} />
                </>
              )}
            <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Cart Reader</Divider>
            </>
          )}
          </>
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
      {!isLoading && (
        <ModalFooterButtonArea>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: '10px 20px 10px 10px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => startGameWithSave()}
          >
            <IoRocketSharp style={{ fontSize: '30px', marginRight: '10px' }} /> {/* Icon for "Start Game With Save" */}
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
      )}
      </ModalFooter>
    </>
  );
};
