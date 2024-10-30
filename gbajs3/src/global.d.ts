declare global {
  interface Window {
      esp32IP?: string;
      additionalData?: any;
      gameData?: any;
      currentCartridgeSaveName?: string;
      hasRun?: boolean;
  }
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {}
