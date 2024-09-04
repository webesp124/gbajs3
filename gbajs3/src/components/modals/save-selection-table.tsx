import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { useEmulatorContext } from '../../hooks/context.tsx';
import { useEffect } from 'react';

interface GameData {
    cartID: string;
}

interface SaveSelectionTableProps {
    gameData: GameData;
    checksum1000String: string | null;
    selectedSave: string;
    setSelectedSave: (save: string) => void;
    saveName: string;
}

export const SaveSelectionTable: React.FC<SaveSelectionTableProps> = ({ gameData, checksum1000String, selectedSave, setSelectedSave, saveName }) => {
    const { emulator } = useEmulatorContext();

    const handleCheckboxChange = (save: string) => {
        setSelectedSave(save);
    };

    const localSaves = emulator?.listSaves?.().filter(save => save.includes(gameData.cartID + "_" + checksum1000String)) || [];

    useEffect(() => {
        for (const entry of localSaves) {
            if (saveName === entry) {
                setSelectedSave(entry);
            }
        }
    }, []);

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Save</TableCell>
                            <TableCell>Last Saved</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key="cartridge-save">
                            <TableCell>
                                <Checkbox
                                    checked={selectedSave === "Cartridge Save"}
                                    onChange={() => handleCheckboxChange("Cartridge Save")}
                                />
                            </TableCell>
                            <TableCell>Cartridge Save</TableCell>
                            <TableCell>-</TableCell>
                        </TableRow>
                        {localSaves.length > 0 ? (
                            localSaves.map((save, index) => (
                                <TableRow 
                                key={index}
                                sx={{ borderBottom: index === localSaves.length - 1 ? 'none' : undefined }}
                                >
                                    <TableCell sx={{ borderBottom: index === localSaves.length - 1 ? 'none' : undefined }}>
                                        <Checkbox
                                            checked={selectedSave === save}
                                            onChange={() => handleCheckboxChange(save)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: index === localSaves.length - 1 ? 'none' : undefined }}>{save}</TableCell>
                                    <TableCell sx={{ borderBottom: index === localSaves.length - 1 ? 'none' : undefined }}>{emulator?.getStatSaves?.(save).mtime.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3}>None</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
