import { Table, TableBody, TableCell, TableContainer, TableRow, Button, Divider, TextField, Select, MenuItem, Alert, Typography, Box } from '@mui/material';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
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
import { getSaveTypeCodeFromString, timeout, fetchGameInfo, saveTypes, getCoverImage } from './util-rom.tsx';
import { SaveSelectionTable } from './save-selection-table.tsx';
import { GameSelectionTable } from './game-selection-table.tsx';
import { useMediaQuery } from '@mui/material';
import {
  getIframeHostReaderURL,
  getRecentReaderURLs,
  type ReaderConnectionTest,
  type ReaderStatus,
  testReaderConnection
} from '../../utils/reader-client.ts';
import {
  exportCartridgeSaveBackups,
  getCartridgeSaveBackups,
  importCartridgeSaveBackups,
  restoreBackupFile,
  type CartridgeSaveBackup
} from '../../utils/save-backups.ts';

type RomLoadingIndicatorProps = {
  isLoading: boolean;
  isExternalRomLoading: boolean;
  children: ReactNode;
  indicator: ReactNode;
  progress: number;
};

export type MyRomStartPageProps = {
  additionalData: any;
  setAdditionalData: (data: any) => void;
  gameData: any;
  setGameData: (data: any) => void;
  esp32IP: string;
  setEsp32IP: (data: string) => void;
  setIsSideMenuExpanded: (data: boolean) => void;
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

const RomCoverHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 0px;
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

const defaultEsp32IP = 'https://192.168.1.3';

const normalizeEsp32IP = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return defaultEsp32IP;

  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
};

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  background-color: ${({ theme }) => theme.modalSurfaceElevated};
  border: 1px solid ${({ theme }) => theme.modalListBorder};
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

const ProgressLabel = styled.span`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  color: ${({ theme }) => theme.modalTextPrimary};
  font-weight: 700;
  line-height: 22px;
  text-align: center;
  text-shadow: 0 1px 2px ${({ theme }) => theme.pureBlack};
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
          <ProgressLabel>{Math.round(progress)}%</ProgressLabel>
        </ProgressBar>
    </RomLoadingContainer>
  ) : (
    children
  );
};

export const MyRomStartPage: React.FC<MyRomStartPageProps> = ({
  additionalData: initialAdditionalData,
  setAdditionalData,
  gameData: initialGameData,
  setGameData,
  esp32IP,
  setEsp32IP,
  setIsSideMenuExpanded,
  }) => {
  
  const theme = useTheme();
  const { closeModal } = useModalContext();
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
    isLoading: isExternalSaveLoading,
    execute: executeLoadExternalSave,
    progress: externalSaveLoadingProgress
  } = useLoadExternalSave();
  const runGame = useRunGame();
  const [isExternalRomInfoLoading, setIsExternalRomInfoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [additionalData, setLocalAdditionalData] = useState(initialAdditionalData);
  const [gameData, setLocalGameData] = useState(initialGameData);

  const shouldUploadExternalRom =
    !isExternalRomLoading && !!externalRomFile;
    
  const [checksum1000String, setChecksum1000String] = useState<string | null>(null);
  const [selectedSave, setSelectedSave] = useState("Cartridge Save");
  const [selectedGame, setSelectedGame] = useState("Cartridge Rom");
  const [cartridgeSaveName, setCartridgeSaveName] = useState(`none.sav`);
  const [currentEsp32IP, setCurrentEsp32IP] = useState(esp32IP);
  const currentEsp32IPRef = useRef(esp32IP);
  const isEditingEsp32IPRef = useRef(false);
  const [recentReaderURLs, setRecentReaderURLs] = useState<string[]>(() => getRecentReaderURLs());
  const [readerConnectionTest, setReaderConnectionTest] = useState<ReaderConnectionTest | null>(null);
  const [isTestingReader, setIsTestingReader] = useState(false);
  const [readerStatus, setReaderStatus] = useState<ReaderStatus | null>(null);
  const [saveBackups, setSaveBackups] = useState<CartridgeSaveBackup[]>(() => getCartridgeSaveBackups());
  const isLargerThanPhone = useMediaQuery(theme.isLargerThanPhone);
  const cartridgeTransferProgress = isExternalSaveLoading
    ? externalSaveLoadingProgress
    : externalRomLoadingProgress;
  
  const handleAdditionalDataChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    const updateAdditionalData = (prevData: any) => ({
      ...prevData,
      [name]: value,
    });

    setLocalAdditionalData(updateAdditionalData);
    setAdditionalData(updateAdditionalData);
  };

  const buildRomName2 = useCallback((gameData: any, additionalData: any, checksum1000String: string) => {
    if (gameData["is_gba"]) {
      if (additionalData && additionalData.fullName)
        return additionalData.fullName + "_" + gameData.cartID + "_" + checksum1000String;
      else
        return gameData.romName + "_" + gameData.cartID + "_" + checksum1000String;
    }
    else {
      if (additionalData && additionalData.fullName)
        return additionalData.fullName + "_" + gameData.romName + "_" + gameData.checksumStr;
      else
        return gameData.romName + "_" + gameData.checksumStr;
    }
  }, []);

  useEffect(() => {
    if (isEditingEsp32IPRef.current) return;

    setCurrentEsp32IP(esp32IP);
    currentEsp32IPRef.current = esp32IP;
  }, [esp32IP]);

  const commitEsp32IP = useCallback((value = currentEsp32IPRef.current) => {
    const nextEsp32IP = normalizeEsp32IP(value);
    currentEsp32IPRef.current = nextEsp32IP;
    setCurrentEsp32IP(nextEsp32IP);
    setEsp32IP(nextEsp32IP);
    setRecentReaderURLs(getRecentReaderURLs());
    return nextEsp32IP;
  }, [setEsp32IP]);

  const testCurrentReaderConnection = useCallback(async () => {
    const nextEsp32IP = commitEsp32IP();
    setIsTestingReader(true);
    const result = await testReaderConnection(nextEsp32IP);
    setReaderConnectionTest(result);
    setReaderStatus(result.status ?? null);
    setRecentReaderURLs(getRecentReaderURLs());
    setIsTestingReader(false);
  }, [commitEsp32IP]);

  const useIframeHostReader = () => {
    const iframeHostURL = getIframeHostReaderURL();
    if (!iframeHostURL) return;
    currentEsp32IPRef.current = iframeHostURL;
    setCurrentEsp32IP(iframeHostURL);
    commitEsp32IP(iframeHostURL);
  };

  const importSaveBackupFile = async (file: File | undefined) => {
    if (!file) return;
    const importedBackups = await importCartridgeSaveBackups(file);
    setSaveBackups(importedBackups);
  };

  useEffect(() => {
    if (shouldUploadExternalRom) {
      const runCallback = () => {
        const hasSucceeded = runGame(externalRomFile.name);
        if (hasSucceeded) {
          closeModal();
          if(!isLargerThanPhone)
            setIsSideMenuExpanded(false);
        }
      };
      emulator?.uploadRom(externalRomFile, runCallback);
    }
  }, [
    shouldUploadExternalRom,
    externalRomFile,
    emulator,
    closeModal,
    runGame
  ]);

  const fetchData = useCallback(async () => {
    try {
        setConnectionFailed(false);
        setIsExternalRomInfoLoading(true);
        const esp32IPToFetch = commitEsp32IP();
        const [
          nextGameData,
          nextAdditionalData,
          nextChecksum1000String,
          success
        ] = await fetchGameInfo(esp32IPToFetch);
        setConnectionFailed(!success);
        setLocalGameData(nextGameData);
        setLocalAdditionalData(nextAdditionalData);
        setGameData(nextGameData);
        setAdditionalData(nextAdditionalData);
        if (nextGameData) setReaderStatus(nextGameData);
        setChecksum1000String(nextChecksum1000String);
        if(nextGameData){
          let saveName = "Main_" + buildRomName2(nextGameData, nextAdditionalData, nextChecksum1000String) + ".sav";
          setCartridgeSaveName(saveName);
        }
    } catch (error) {
        console.error('Error fetching game info:', error);
    } finally {
        setIsExternalRomInfoLoading(false);
    }
  }, [buildRomName2, commitEsp32IP, setAdditionalData, setGameData]);
  
  useEffect(() => {
     if(externalSaveFile != null)
       emulator?.uploadSaveOrSaveState(externalSaveFile);
  }, [
    externalSaveFile,
    emulator,
  ]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (connectionFailed && !isExternalRomInfoLoading) {
      const reconnectInterval = setInterval(() => {
        if (connectionFailed && !isExternalRomInfoLoading && !isEditingEsp32IPRef.current)
          fetchData();
      }, 5000);

      return () => clearInterval(reconnectInterval);
    }
  }, [connectionFailed, fetchData, isExternalRomInfoLoading]);

  const startGameWithSave = async () => {
    setIsLoading(true);
    console.log("Using save: " + selectedSave);

    let saveName = buildRomName() + ".sav";
    if (selectedSave == "Cartridge Save"){
      if (gameData["is_gba"])
        await fetchMySave_gba(additionalData.saveType, saveName);
      else
        if (gameData["sramSize"])
          await fetchMySave_gb(saveName);
    }
    //else
    //  emulator?.uploadSaveOrSaveState(emulator?.getFile("/data/saves/" + selectedSave));
    await timeout(300);
    console.log("save loaded");

    await startGameWithoutSave();
    setIsLoading(false);
  };
  
  // Function to try to start a locally existing rom file
  const startGameLocally = async (romName: string) => {
    let localRoms = emulator?.listRoms?.();
    console.log(localRoms);
    if(localRoms && localRoms.includes(romName)){
      console.log("rom exists locally");
      runGame(romName);
      closeModal();
      setIsLoading(false);
      if(!isLargerThanPhone)
        setIsSideMenuExpanded(false);
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
       const esp32IPForRequest = normalizeEsp32IP(currentEsp32IPRef.current);
       if (gameData["is_gba"]){
        let romName = buildRomName() + ".gba";
        let cartSizeBytes = additionalData.cartSize;
        let romURL = `${esp32IPForRequest}/get_current_game.gba?cartSize=${cartSizeBytes}&saveType=4`;

        await executeLoadExternalRom({ url: new URL(romURL), fullName: romName, patchFile: additionalData.patchFile });
       }
       else {
        let romName = buildRomName() + ".gb";
        let romURL = `${esp32IPForRequest}/get_current_game.gb`;

        await executeLoadExternalRom({ url: new URL(romURL), fullName: romName, patchFile: null });
       }
    }
    setIsLoading(false);
  };
  
  // Function to fetch the save
  const fetchMySave_gba = async (saveTypeString: string, fullName: string) => {
    try {
      console.log(saveTypeString);
      var saveType = getSaveTypeCodeFromString(saveTypeString);
      if (saveType == -1) {
        console.log("Invalid Save Type");
        return;
      }
      console.log(saveType);
      
      var saveURL = `${normalizeEsp32IP(currentEsp32IPRef.current)}/get_current_save?saveType=${saveType}`;
      await executeLoadExternalSave({ url: new URL(saveURL), fullName: fullName });

    } catch (error) {
      console.error('Error fetching save:', error);
    } finally {
    }
  };

  const fetchMySave_gb = async (fullName: string) => {
    try {
      var saveURL = `${normalizeEsp32IP(currentEsp32IPRef.current)}/get_current_save`;
      await executeLoadExternalSave({ url: new URL(saveURL), fullName: fullName, expectedBytes: gameData?.sramSize });

    } catch (error) {
      console.error('Error fetching save:', error);
    } finally {
    }
  };

  const buildRomName = () => {
    if (gameData["is_gba"]) {
      if (additionalData && additionalData.fullName)
        return additionalData.fullName + "_" + gameData.cartID + "_" + checksum1000String;
      else
        return gameData.romName + "_" + gameData.cartID + "_" + checksum1000String;
    }
    else {
      if (additionalData && additionalData.fullName)
        return additionalData.fullName + "_" + gameData.romName + "_" + gameData.checksumStr;
      else
        return gameData.romName + "_" + gameData.checksumStr;
    }
  };

  interface LoadingModalHeaderProps {
    title: string;
  }

  const LoadingModalHeader: React.FC<LoadingModalHeaderProps> = ({ title }) => {
    const [dots, setDots] = useState('');
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
  
      return () => clearInterval(interval);
    }, []);
  
    return <ModalHeader title={`${title}${dots}`} />;
  };

  return (
    <>
      {!connectionFailed ? (
        <>
        {gameData && additionalData && additionalData.fullName ? (
        <ModalHeader title={additionalData.fullName} />
        ) : gameData && (!additionalData || !additionalData.fullName) ? (
        <ModalHeader title={gameData.romName == "" || gameData.romName == "Error" ? "Error Reading Cartridge": gameData.romName} />
        ) : !gameData && additionalData && additionalData.fullName ? (
        <ModalHeader title={additionalData.fullName} />
        ) : (
        <LoadingModalHeader title="Connecting to cartridge reader" />
        )}
        </>
      ) : (
        <ModalHeader title="Connection to cartridge reader failed!" />
      )}
      <ModalBody>
        <RomLoadingIndicator
          isLoading={isLoading}
          isExternalRomLoading={!isExternalSaveLoading && isExternalRomLoading}
          indicator={
            <PacmanLoader
              color={theme.gbaThemeBlue}
              cssOverride={{ margin: '0 auto' }}
            />
          }
          progress={cartridgeTransferProgress}
        >

            {!!externalRomLoadError && (
              <ErrorWithIcon
                icon={<BiError style={{ color: theme.errorRed }} />}
                text="Loading rom from URL has failed"
              />
            )}
          
            <>
          {gameData && (
            <>
            {additionalData && additionalData.fullName ? (
              <RomCoverHeaderContainer>
                <GameInfoImage
                  id="cover-image"
                  src={getCoverImage(gameData, additionalData)}
                  alt={`${additionalData.fullName} Cover`}
                />
                {gameData && gameData.is_gba && checksum1000String != additionalData.checksum1000 && (
                  <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Alert severity="error" variant="outlined" sx={{ width: '100%', maxWidth: 400, paddingTop: 0, paddingBottom: 0, fontSize: 28, "& .MuiAlert-icon": {
                          fontSize: 28,
                          paddingTop: "12px",
                        }, }}>
                      <Typography variant="subtitle1" color="error" sx={{ fontWeight: 'medium' }}>
                        Checksum Mismatch
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The checksum of this file does not match the expected value.
                        Please verify the ROM file integrity.
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </RomCoverHeaderContainer>
            ) : (
              <RomCoverHeaderContainer>
                <GameInfoImage
                  id="cover-image"
                  src={"./img/cover_img_missing.jpeg"}
                  alt={"Cover missing Image"}
                />
                <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Alert severity="error" variant="outlined" sx={{ width: '100%', maxWidth: 400, paddingTop: 0, paddingBottom: 0, fontSize: 28, "& .MuiAlert-icon": {
                          fontSize: 28,
                          paddingTop: "12px",
                        }, }}>
                      <Typography variant="subtitle1" color="error" sx={{ fontWeight: 'medium' }}>
                        ROM Information Not Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No information about the ROM found. Please verify the ROM size and save type.
                      </Typography>
                    </Alert>
                  </Box>
              </RomCoverHeaderContainer>
            )}
          <TableContainer id="game-info"><Table><TableBody>
            {additionalData && additionalData.fullName && (
            <TableRow><TableCell>Full Name:</TableCell><TableCell>{additionalData.fullName}</TableCell></TableRow>
            )}
             
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
            
            {gameData && gameData.is_gba && (
            <TableRow>
              <TableCell>Save Type:</TableCell>
              <TableCell><Select
                name="saveType"
                value={additionalData ? additionalData.saveType : "REPRO_FLASH1M"}
                onChange={handleAdditionalDataChange}
              >
                {saveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select></TableCell>
            </TableRow>
            )}
            {additionalData && additionalData.patchFile != null && additionalData.patchFile.length > 0 && (
              <TableRow><TableCell>Patch File:</TableCell><TableCell>{additionalData.patchFile}</TableCell></TableRow>
            )}

            {gameData && gameData.is_gba && (
            <TableRow><TableCell>Cart ID:</TableCell><TableCell>{gameData.cartID}</TableCell></TableRow>
            )}
            <TableRow><TableCell>ROM Version:</TableCell><TableCell>{gameData.romVersion}</TableCell></TableRow>
            {gameData && gameData.is_gba && (
            <TableRow><TableCell>Checksum:</TableCell><TableCell>0x{checksum1000String}</TableCell></TableRow>
            )}
            {gameData && !gameData.is_gba && (
            <TableRow><TableCell>Checksum:</TableCell><TableCell>0x{gameData.checksum_gb}</TableCell></TableRow>
            )}
            {gameData && !gameData.is_gba && (
            <TableRow><TableCell>Global Checksum:</TableCell><TableCell>0x{gameData.checksumStr}</TableCell></TableRow>
            )}

            {additionalData && additionalData.publisher && additionalData.releaseDate && (
              <>
            <TableRow><TableCell>Publisher:</TableCell><TableCell>{additionalData.publisher}</TableCell></TableRow>
            <TableRow><TableCell style={{border:"none"}}>Release Date:</TableCell><TableCell style={{border:"none"}}>{additionalData.releaseDate}</TableCell></TableRow>
              </>
            )}
          </TableBody></Table></TableContainer>
        
        {emulator && (
          <>
            <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Local Saves</Divider>

            {gameData && gameData.is_gba && (
            <SaveSelectionTable gameData={gameData} checksum1000String={checksum1000String} selectedSave={selectedSave} setSelectedSave={setSelectedSave} saveName={buildRomName() + ".sav"} cartridgeSaveName={cartridgeSaveName} setCartridgeSaveName={setCartridgeSaveName} />
            )}
            {gameData && !gameData.is_gba && (
            <SaveSelectionTable gameData={gameData} checksum1000String={gameData.checksum_gb} selectedSave={selectedSave} setSelectedSave={setSelectedSave} saveName={buildRomName() + ".sav"} cartridgeSaveName={cartridgeSaveName} setCartridgeSaveName={setCartridgeSaveName} />
            )}

            <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Local Roms</Divider>

            {gameData && gameData.is_gba && (
            <GameSelectionTable gameData={gameData} checksum1000String={checksum1000String} selectedGame={selectedGame} setSelectedGame={setSelectedGame} romName={buildRomName() + ".gba"} />
            )}
            {gameData && !gameData.is_gba && (
            <GameSelectionTable gameData={gameData} checksum1000String={gameData.checksum_gb} selectedGame={selectedGame} setSelectedGame={setSelectedGame} romName={buildRomName() + ".gb"} />
            )}
          </>
        )}
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Cart Reader</Divider>

        </>
        )}
        {!gameData && !additionalData && (
          <RomLoadingContainer>
            <GameInfoImage
              src="./img/connect.jpeg"
              alt="waiting for cartridge reader response illustration"
            />
          </RomLoadingContainer>
        )}
        {gameData && !additionalData && (gameData.romName == "" || gameData.romName == "Error") && (
          <RomLoadingContainer>
            <GameInfoImage
              src="./img/error_cart.jpeg"
              alt="can not correctly read cartridge illustration"
            />
          </RomLoadingContainer>
        )}
        </>
        
        <StyledForm
            aria-label="Login Form"
            onSubmit={(event) => {
              event.preventDefault();
              isEditingEsp32IPRef.current = false;
              fetchData();
            }}
          >
            <TextField
              label="ESP32 IP Address"
              autoComplete="esp32IPInputField"
              variant="filled"
              style={{ padding: '3px 8px 3px 8px', fontSize: '14px', marginLeft: '5px' }}
              value={currentEsp32IP}
              onFocus={() => {
                isEditingEsp32IPRef.current = true;
              }}
              onBlur={() => {
                isEditingEsp32IPRef.current = false;
                commitEsp32IP();
              }}
              onChange={(event) => {
                const nextEsp32IP = event.target.value;
                currentEsp32IPRef.current = nextEsp32IP;
                setCurrentEsp32IP(nextEsp32IP);
                setConnectionFailed(false);
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', px: 1 }}>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={testCurrentReaderConnection}
                disabled={isTestingReader}
              >
                {isTestingReader ? 'Testing...' : 'Test Connection'}
              </Button>
              {getIframeHostReaderURL() && (
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={useIframeHostReader}
                >
                  Use Frame Host
                </Button>
              )}
              {recentReaderURLs.map((readerURL) => (
                <Button
                  key={readerURL}
                  type="button"
                  variant="text"
                  size="small"
                  onClick={() => {
                    currentEsp32IPRef.current = readerURL;
                    setCurrentEsp32IP(readerURL);
                    commitEsp32IP(readerURL);
                  }}
                >
                  {readerURL.replace(/^https?:\/\//, '')}
                </Button>
              ))}
            </Box>
            {readerConnectionTest && (
              <Alert
                severity={readerConnectionTest.ok ? 'success' : 'error'}
                variant="outlined"
                sx={{ mx: 1 }}
              >
                {readerConnectionTest.message}
              </Alert>
            )}
            {readerStatus && (
              <Box sx={{ mx: 1 }}>
                <Typography variant="subtitle2">Reader Status</Typography>
                <Typography variant="body2">
                  Firmware: {String(readerStatus.firmware_version ?? 'unknown')}
                </Typography>
                <Typography variant="body2">
                  IP: {String(readerStatus.wifi_ip_address ?? readerStatus.web_url ?? 'unknown')}
                </Typography>
                <Typography variant="body2">
                  SSL: {String(readerStatus.ssl_mode ?? readerStatus.ssl_enabled ?? 'unknown')}
                </Typography>
                {readerStatus.battery && (
                  <Typography variant="body2">
                    Battery: {readerStatus.battery.percent ?? '?'}% · {readerStatus.battery.millivolts ?? '?'} mV
                  </Typography>
                )}
              </Box>
            )}
            <Box sx={{ mx: 1 }}>
              <Typography variant="subtitle2">Save Backups</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSaveBackups(getCartridgeSaveBackups());
                    exportCartridgeSaveBackups();
                  }}
                  disabled={saveBackups.length === 0}
                >
                  Export
                </Button>
                <Button component="label" variant="outlined" size="small">
                  Import
                  <input
                    hidden
                    type="file"
                    accept="application/json"
                    onChange={(event) => {
                      importSaveBackupFile(event.target.files?.[0]);
                      event.target.value = '';
                    }}
                  />
                </Button>
              </Box>
              {saveBackups.slice(0, 3).map((backup) => (
                <Box
                  key={backup.id}
                  sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption">
                    {backup.gameName} · {new Date(backup.createdAt).toLocaleString()} · {(backup.size / 1024).toFixed(1)} KB
                  </Typography>
                  <Button
                    type="button"
                    size="small"
                    onClick={() => {
                      emulator?.uploadSaveOrSaveState(restoreBackupFile(backup));
                    }}
                    disabled={!emulator}
                  >
                    Load
                  </Button>
                </Box>
              ))}
            </Box>
            <Button
              type="button"
              variant="outlined"
              style={{ padding: '3px 8px 3px 8px', fontSize: '14px', marginLeft: '8px' }}
              onClick={() => {
                isEditingEsp32IPRef.current = false;
                fetchData();
              }}
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
          {gameData && (
          <Button
            variant="contained"
            color="primary"
            style={{ padding: '10px 20px 10px 10px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => startGameWithSave()}
          >
            <IoRocketSharp style={{ fontSize: '30px', marginRight: '10px' }} /> {/* Icon for "Start Game With Save" */}
            Start Game
          </Button>
          )}
          <Button
            variant="outlined"
            style={{ padding: '10px 20px 10px 20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={closeModal}
          >
            Close
          </Button>
        </ModalFooterButtonArea>
      )}
      </ModalFooter>
    </>
  );
};
