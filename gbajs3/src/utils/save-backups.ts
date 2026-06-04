export type CartridgeSaveBackup = {
  id: string;
  createdAt: string;
  name: string;
  readerURL: string;
  gameName: string;
  cartridgeType: 'gba' | 'gb';
  saveType?: string;
  size: number;
  dataBase64: string;
};

const backupStorageKey = 'netboy-cartridge-save-backups';
const maxBackups = 12;

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64: string) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
};

export const getCartridgeSaveBackups = (): CartridgeSaveBackup[] => {
  if (typeof window === 'undefined') return [];
  try {
    const backups = JSON.parse(window.localStorage.getItem(backupStorageKey) ?? '[]');
    return Array.isArray(backups) ? backups : [];
  } catch {
    return [];
  }
};

export const createCartridgeSaveBackup = (backup: Omit<CartridgeSaveBackup, 'id' | 'createdAt' | 'dataBase64' | 'size'>, data: ArrayBuffer) => {
  const nextBackup: CartridgeSaveBackup = {
    ...backup,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    size: data.byteLength,
    dataBase64: arrayBufferToBase64(data)
  };
  const backups = [nextBackup, ...getCartridgeSaveBackups()].slice(0, maxBackups);
  window.localStorage.setItem(backupStorageKey, JSON.stringify(backups));
  return nextBackup;
};

export const restoreBackupFile = (backup: CartridgeSaveBackup) =>
  new File([base64ToArrayBuffer(backup.dataBase64)], backup.name);

export const exportCartridgeSaveBackups = () => {
  const blob = new Blob([JSON.stringify(getCartridgeSaveBackups(), null, 2)], {
    type: 'application/json'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `netboy-save-backups-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const importCartridgeSaveBackups = async (file: File) => {
  const backups = JSON.parse(await file.text());
  if (!Array.isArray(backups)) throw new Error('Backup export is not a list.');
  window.localStorage.setItem(backupStorageKey, JSON.stringify(backups.slice(0, maxBackups)));
  return getCartridgeSaveBackups();
};

