import toast from 'react-hot-toast';
import {
  downloadReaderSave,
  explainReaderError,
  getReaderGameInfo,
  uploadReaderSave
} from '../../utils/reader-client.ts';
import { createCartridgeSaveBackup } from '../../utils/save-backups.ts';

export const linkCartridgeInformation = "https://raw.githubusercontent.com/webesp124/gb_data/refs/heads/main";
export const missingCoverImage = "./img/cover_img_missing.jpeg";

export const saveTypes = [
  "FLASH1M_V102",
  "FLASH1M_V103",
  "FLASH_V124",
  "FLASH_V126",
  "FLASH_ECLA",
  "EEPROM_V122",
  "EEPROM_V124",
  "SRAM_V112",
  "SRAM_V113",
  "REPRO_FLASH1M",
  "NONE",
];

const getSaveTypeCodeFromString = (saveTypeString: string) => {
    console.log("Save Type: " + saveTypeString);
    
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

const getSaveSizeFromTypeCode = (saveType: number) => {
  if (saveType == 1) return 512;
  if (saveType == 2) return 8192;
  if (saveType == 3) return 32768;
  if (saveType == 4) return 65536;
  if (saveType == 5 || saveType == 21 || saveType == 55) return 131072;
  if (saveType == 6) return 65536;
  return undefined;
};

const toUint8Array = (data: Uint8Array | ArrayBuffer) =>
  data instanceof Uint8Array ? data : new Uint8Array(data);

const assertSaveReadbackMatches = (
  expectedSave: Uint8Array,
  readbackBuffer: ArrayBuffer,
  compareSize: number
) => {
  const expected = expectedSave.slice(0, compareSize);
  const actual = toUint8Array(readbackBuffer).slice(0, compareSize);

  if (actual.length < compareSize) {
    throw new Error(
      `Read back ${actual.length} save bytes, expected ${compareSize}.`
    );
  }

  for (let index = 0; index < compareSize; index++) {
    if (actual[index] !== expected[index]) {
      throw new Error(
        `Save read-back mismatch at byte ${index}: expected 0x${expected[index].toString(16).padStart(2, '0')}, got 0x${actual[index].toString(16).padStart(2, '0')}.`
      );
    }
  }
};

const getChecksum1000 = (gameData: { checksum_1MB: string; checksum_2MB: string; checksum_4MB: string; checksum_8MB: string; checksum_16MB: string; }, additionalData: { cartSize: number; saveType: string }) => {
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
  else
    checksum1000 = gameData.checksum_16MB;
  
  return checksum1000.toUpperCase();
}

const timeout = (delay: number) => {
  return new Promise( res => setTimeout(res, delay) );
}

// Function to fetch and display game information
const fetchGameInfo = async (esp32IP: string): Promise<[any, any, string, boolean]> => {
  let gameData, additionalData;
  additionalData = null;
  let responseCartridgeReaderOk = false;
  let checksum1000 = "";
  try {
    // Fetch the basic game info
    gameData = await getReaderGameInfo(esp32IP, {
      timeoutMs: 12000,
      retries: 1,
      phase: 'connecting'
    }) as any;

    if(gameData.romName == ""){
      throw new Error(`Error Reading Cartridge, ROM name empty`);
    }

    responseCartridgeReaderOk = true;

    if (gameData["is_gba"]) {
      // Fetch additional information using the cartID
      const additionalResponse = await fetch(linkCartridgeInformation + `/information_rom_gba/${gameData.cartID}.json?updated=123456789d01`);
      additionalData = await additionalResponse.json();
      console.log(additionalData);
      
      if(!additionalData)
        additionalData = {"saveType": "REPRO_FLASH1M", "cartSize": 16*1024*1024};
      checksum1000 = getChecksum1000(gameData, additionalData);
      
      if(checksum1000 != additionalData.checksum1000){
        console.log("Checksums do not match. Trying to get a different one...");
        
        try {
          const additionalResponseAdd = await fetch(linkCartridgeInformation + `/information_rom_gba/${checksum1000}-${gameData.cartID}.json?updated=12345678d901`);

          // Check if the response is successful
          if (!additionalResponseAdd.ok  || additionalResponseAdd.status != 200) {
              throw new Error(`HTTP error! Status: ${additionalResponseAdd.status}`);
          }

          let additionalDataAdd = await additionalResponseAdd.json();

          // Check if additionalDataAdd is not empty or undefined
          if (additionalDataAdd && Object.keys(additionalDataAdd).length > 0) {
              console.log("Additional Data exists");
              additionalData = additionalDataAdd;
          } else {
              console.log("Additional Data does not exist or is empty");
          }
        } catch (error) {
          console.error("An error occurred while fetching additional data: ", error);
        }
      }
    } else {
      const additionalResponse = await fetch(linkCartridgeInformation + `/information_rom_gb/${gameData.romName}.json`);
      additionalData = await additionalResponse.json();
      console.log(additionalData);
      
      if(gameData.checksumStr != additionalData.global_checksum){
        console.log("Checksums do not match. Trying to get a different one...");
      }
    }
    if(gameData && !additionalData){
      additionalData = {"saveType": "REPRO_FLASH1M", "cartSize": 16*1024*1024};
      checksum1000 = getChecksum1000(gameData, additionalData);
    }
    return [gameData, additionalData, checksum1000, responseCartridgeReaderOk];
  } catch (error) {
    console.error('Error fetching game information:', explainReaderError(error));
  } finally {
    if(gameData && !additionalData){
      additionalData = {"saveType": "REPRO_FLASH1M", "cartSize": 16*1024*1024};
      checksum1000 = getChecksum1000(gameData, additionalData);
    }
    return [gameData, additionalData, checksum1000, responseCartridgeReaderOk];
  }
};

const getCoverImage = (gameData: { is_gba: boolean; }, additionalData: { coverImage: string; }) => {
  let coverImage = additionalData.coverImage;

  if (coverImage) {
      // If the cover image starts with '/', adjust the path based on gameData.is_gba
      if (coverImage.startsWith('/')) {
          if (gameData.is_gba) {
              return linkCartridgeInformation + coverImage.replace('/covers/', '/covers_gba/');
          } else {
              return linkCartridgeInformation + coverImage.replace('/covers/', '/covers_gb/');
          }
      } else if (coverImage.startsWith('.')) {
          if (gameData.is_gba) {
              return linkCartridgeInformation + coverImage.substring(1).replace('/covers/', '/covers_gba/');
          } else {
              return linkCartridgeInformation + coverImage.substring(1).replace('/covers/', '/covers_gb/');
          }
      } else {
          // If coverImage doesn't start with '/', return it as is
          return coverImage;
      }
  }

  return missingCoverImage;
};

type UploadSaveToCartridgeOptions = {
  confirm?: boolean;
  backup?: boolean;
  toastId?: string;
  loadingMessage?: string;
  successMessage?: string;
};

const uploadSaveToCartridge = async (
  additionalData: { coverImage: string; saveType: string; fullName?: string },
  emulator: any,
  esp32IP: string,
  options: UploadSaveToCartridgeOptions = {}
) => {
  const {
    confirm = true,
    backup = true,
    toastId = 'cartridge-save-upload',
    loadingMessage = backup ? 'Backing up cartridge save...' : 'Uploading save to cartridge...',
    successMessage = backup
      ? 'Backed up, uploaded, and verified save on cartridge'
      : 'Uploaded and verified save on cartridge'
  } = options;

  if (typeof emulator?.getCurrentSave !== 'function' || typeof emulator?.getCurrentSaveName !== 'function') {
    toast.error('Current emulator does not expose save data yet');
    return;
  }

  const rawSave = emulator.getCurrentSave();
  const saveName = emulator.getCurrentSaveName();
  const currentGameData = window.gameData;
  const isGba = currentGameData?.is_gba !== false;

  if (rawSave && saveName) {
    if(!additionalData){
        toast.error('No save type information');
        return;
    }
    
    if (isGba && !additionalData.saveType) {
      toast.error('GBA save type is not set');
      return;
    }

    const saveType = isGba ? getSaveTypeCodeFromString(additionalData.saveType) : undefined;
    if (isGba && saveType == -1) {
        toast.error('Invalid save type');
        return;
    }

    const saveSize = isGba && saveType !== undefined
      ? getSaveSizeFromTypeCode(saveType)
      : undefined;
    const save = isGba && saveSize && typeof emulator.getCurrentSaveTruncated === 'function'
      ? emulator.getCurrentSaveTruncated(saveSize)
      : rawSave;

    if (!save) {
      toast.error('Current save could not be prepared for cartridge upload');
      return;
    }

    if (confirm) {
      const confirmed = window.confirm(
        [
          'Write the current emulator save to the inserted cartridge?',
          '',
          backup
            ? 'NetBoy will first back up the current cartridge save, then upload the new save and read it back for comparison.'
            : 'NetBoy will upload the new save and read it back for comparison.',
          'Keep the reader powered and do not remove the cartridge during this operation.'
        ].join('\n')
      );

      if (!confirmed) {
        return;
      }
    }

    toast.loading('Preparing cartridge save upload...', {
      id: toastId
    });

    const uploadPromise = (async () => {
      if (backup) {
        try {
          const backupData = await downloadReaderSave(esp32IP, saveType, {
            timeoutMs: 20000,
            retries: 0
          });
          createCartridgeSaveBackup(
            {
              name: `Backup_${saveName}`,
              readerURL: esp32IP,
              gameName: additionalData.fullName ?? emulator.getCurrentGameName?.() ?? saveName,
              cartridgeType: isGba ? 'gba' : 'gb',
              saveType: isGba ? additionalData.saveType : undefined
            },
            backupData
          );
        } catch (error) {
          if (!confirm) throw error;
          const keepGoing = window.confirm(
            [
              'Could not back up the current cartridge save.',
              explainReaderError(error),
              '',
              'Continue writing anyway? This can overwrite the cartridge save without a local backup.'
            ].join('\n')
          );
          if (!keepGoing) throw error;
        }
      }

      await uploadReaderSave(esp32IP, save as XMLHttpRequestBodyInit, saveType);
      const readback = await downloadReaderSave(esp32IP, saveType, {
        timeoutMs: 90000,
        retries: 0
      });
      assertSaveReadbackMatches(toUint8Array(save), readback, saveSize ?? save.byteLength);
      return successMessage;
    })();

    toast.promise(uploadPromise, {
      loading: loadingMessage,
      success: (msg) => `${msg}`,
      error: (err) => explainReaderError(err),
    }, {
      id: toastId,
      success: {
        duration: 5000,
      },
      error: {
        duration: 8000,
      },
    });

    try {
      await uploadPromise;
    } catch {
      // toast.promise already renders the user-facing failure.
    }
  } else {
    toast.error('Current save not available');
  }
}

// Custom patching function in TypeScript
async function applyCustomPatch(fetchProps: any, fileData: Uint8Array): Promise<File> {
  // Helper function to parse the patch file
  async function parseTransformedChanges(url: string): Promise<{ changes: any[], checksumChanges: number }> {
      const response = await fetch(url + "?updated=123456789d01");
      const text = await response.text();
      const changes: any[] = [];
      let checksumChanges = 0;
      let currentGroup: any = null;

      const lines = text.split("\n");
      const changeGroupRegex = /Change Group \d+: Start = (0x[0-9a-fA-F]+), End = (0x[0-9a-fA-F]+)/;
      const byteChangeRegex = /Original: ([0-9a-fA-F]+) -> Modified: ([0-9a-fA-F*]+)/;
      const checksumRegex = /Checksum Changes: ([0-9a-fA-F]+)/;

      for (const line of lines) {
          const groupMatch = line.match(changeGroupRegex);
          if (groupMatch) {
              if (currentGroup) changes.push(currentGroup);
              const start = parseInt(groupMatch[1], 16);
              const end = parseInt(groupMatch[2], 16);
              currentGroup = { start, end, modifications: [] };
              continue;
          }

          const byteMatch = line.match(byteChangeRegex);
          if (byteMatch && currentGroup) {
              currentGroup.modifications.push([byteMatch[1], byteMatch[2]]);
          }

          const checksumMatch = line.match(checksumRegex);
          if (checksumMatch) {
              checksumChanges = parseInt(checksumMatch[1], 16);
          }
      }
      if (currentGroup) changes.push(currentGroup);

      console.log(`Checksum changes: ${checksumChanges}`);
      return { changes, checksumChanges };
  }

  // Compatibility check for changes
  function testCompatibilityChanges(data: Uint8Array, changes: any[], checksumChanges: number): boolean {
      let cumulativeChecksumFull = 0;

      changes.forEach(group => {
          const { start, modifications } = group;
          modifications.forEach(([, modified]: [any, string], i: number) => {
              const modValue = data[start + i];
              if (modified !== "*") {
                  cumulativeChecksumFull = (cumulativeChecksumFull + modValue) & 0xFFFFFFFF;
              }
          });
      });

      console.log(`Cumulative checksum full: ${cumulativeChecksumFull}`);
      return cumulativeChecksumFull === checksumChanges;
  }

  // Function to calculate original byte values
  function calculateOrigValue(modValue: number, difference: number): number {
      return (modValue - difference) & 0xFF;
  }

  // Main patch application
  async function applyTransformedChanges(data: Uint8Array, changes: any[]): Promise<Uint8Array> {
      let cumulativeChecksum = 0;

      changes.forEach(group => {
          const { start, modifications } = group;
          modifications.forEach(([original, modified]: [string, string], i: number) => {
              const modValue = data[start + i];
              if (modified !== "*") {
                  cumulativeChecksum = (cumulativeChecksum + modValue) & 0xFF;
              }

              console.log(`Cumulative checksum: ${cumulativeChecksum.toString(16)}, Modified: ${modified}`);

              const newOriginal = modified !== "*" ? calculateOrigValue(modValue, parseInt(original, 16)) 
                                                   : calculateOrigValue(cumulativeChecksum, parseInt(original, 16));
              console.log(`New original: ${newOriginal.toString(16)}`);

              if (original !== "*") {
                  data[start + i] = newOriginal;
              }
          });
      });

      return data;
  }

  try {
      const { changes, checksumChanges } = await parseTransformedChanges(fetchProps.patchFile);
      const sourceData = new Uint8Array(fileData);

      if (!testCompatibilityChanges(sourceData, changes, checksumChanges)) {
          throw new Error("Checksum mismatch; patch may not be compatible with the ROM.");
      }

      const patchedData = await applyTransformedChanges(sourceData, changes);
      const patchedFile = new File([patchedData as BlobPart], fetchProps.fullName ?? fetchProps.fileName ?? "patched_file.gba");
      return patchedFile;
  } catch (error: any) {
      console.error("Failed to apply custom patch:", error);
      throw new Error(`Patch application failed: ${error.message}`);
  }
}

export {getSaveTypeCodeFromString, getChecksum1000, timeout, fetchGameInfo, getCoverImage, uploadSaveToCartridge, applyCustomPatch}
