declare global {
  interface Window {
      esp32IP?: string;
      additionalData?: any;
      gameData?: any;
  }
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {}
