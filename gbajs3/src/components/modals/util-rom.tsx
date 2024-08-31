const getSaveTypeCodeFromString = (saveTypeString: string[]) => {
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
const fetchGameInfo = async (esp32IP: string[]): Promise<[any, any, string]> => {
  let gameData, additionalData, checksum1000;
  try {
    // Fetch the basic game info
    const response = await fetch(`${esp32IP}/get_game_info`, {
      method: 'GET',
      headers: {
        'Access-Control-Request-Private-Network': 'true',
      }
    });

    gameData = await response.json();

    // Fetch additional information using the cartID
    const additionalResponse = await fetch(`./information_rom/${gameData.cartID}.json`);
    additionalData = await additionalResponse.json();
    
    checksum1000 = getChecksum1000(gameData, additionalData);
    
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
            console.log("Additional Data exists");
            additionalData = additionalDataAdd;
        } else {
            console.log("Additional Data does not exist or is empty");
        }
      } catch (error) {
        console.error("An error occurred while fetching additional data: ", error);
      }
    }
    
    return [gameData, additionalData, checksum1000];
  } catch (error) {
    console.error('Error fetching game information:', error);
  } finally {
    return [gameData, additionalData, ""];
  }
};

export {getSaveTypeCodeFromString, getChecksum1000, timeout, fetchGameInfo}