import toast from 'react-hot-toast';

export const linkCartridgeInformation = "https://raw.githubusercontent.com/webesp124/gb_data/refs/heads/main";

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

const timeout = (delay: number) => {
  return new Promise( res => setTimeout(res, delay) );
}

// Function to fetch and display game information
const fetchGameInfo = async (esp32IP: string[]): Promise<[any, any, string, boolean]> => {
  let gameData, additionalData;
  additionalData = null;
  let responseCartridgeReaderOk = false;
  let checksum1000 = "";
  try {
    // Fetch the basic game info
    const response = await fetch(`${esp32IP}/get_game_info`, {
      method: 'GET',
      headers: {
        'Access-Control-Request-Private-Network': 'true',
      }
    });

    gameData = await response.json();

    if(gameData.romName == ""){
      throw new Error(`Error Reading Cartridge, ROM name empty`);
    }

    responseCartridgeReaderOk = true;

    if (gameData["is_gba"]) {
      // Fetch additional information using the cartID
      const additionalResponse = await fetch(linkCartridgeInformation + `/information_rom_gba/${gameData.cartID}.json`);
      additionalData = await additionalResponse.json();
      console.log(additionalData);
      
      checksum1000 = getChecksum1000(gameData, additionalData);
      
      if(checksum1000 != additionalData.checksum1000){
        console.log("Checksums do not match. Trying to get a different one...");
        
        try {
          const additionalResponseAdd = await fetch(linkCartridgeInformation + `/information_rom_gba/${checksum1000}-${gameData.cartID}.json`);

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

    return [gameData, additionalData, checksum1000, responseCartridgeReaderOk];
  } catch (error) {
    console.error('Error fetching game information:', error);
  } finally {
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

  // Return an empty string if no coverImage is provided
  return "";
};

const uploadSaveToCartridge = (additionalData: { coverImage: string; saveType: string }, emulator: any, esp32IP: string) => {
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
            const xhrVerify = new XMLHttpRequest();
            xhrVerify.open('POST', `${esp32IP}/verify_save_file?saveType=${saveType}`, true);

            xhrVerify.onload = () => {
              if (xhrVerify.status >= 200 && xhrVerify.status < 300) {
                resolve('Uploaded  and verified save on cartridge'); // Resolves the promise when successful
              } else {
                reject('Save on cartridge has errors'); // Rejects the promise on failure
              }
            };

            xhrVerify.onerror = () => reject('Failed to upload save for verification'); // Handles network errors

            xhrVerify.send(save);
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
}

export {getSaveTypeCodeFromString, getChecksum1000, timeout, fetchGameInfo, getCoverImage, uploadSaveToCartridge}