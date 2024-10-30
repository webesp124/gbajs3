import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Box, Typography, Button, TextField } from '@mui/material';
import { useEmulatorContext } from '../../hooks/context.tsx';
import { useState, useEffect } from 'react';

interface GameData {
    cartID: string;
}

interface SaveSelectionTableProps {
    gameData: GameData;
    checksum1000String: string | null;
    selectedSave: string;
    setSelectedSave: (save: string) => void;
    saveName: string;
    cartridgeSaveName: string;
    setCartridgeSaveName: (save: string) => void;
}

export const SaveSelectionTable: React.FC<SaveSelectionTableProps> = ({ gameData, checksum1000String, selectedSave, setSelectedSave, saveName, cartridgeSaveName, setCartridgeSaveName }) => {
    const { emulator } = useEmulatorContext();
    const [uploadedSave, setUploadedSave] = useState<File | null>(null);

    useEffect(() => {
        if (selectedSave == "Cartridge Save") {
            console.log("cartridge save selected");
            console.log(cartridgeSaveName);
            window.currentCartridgeSaveName = cartridgeSaveName;
        } else if (selectedSave) {
            console.log("existing save selected");
            console.log(selectedSave);
            window.currentCartridgeSaveName = selectedSave;
        } else {
            console.log("setting to none.sav");
            window.currentCartridgeSaveName = "none.sav";
        }
    }, [selectedSave, cartridgeSaveName, uploadedSave]);

    const handleCheckboxChange = (save: string) => {
        console.log("checkbox changed");
        setSelectedSave(save);

        if (save != "Cartridge Save") {
            const saveFile = emulator?.getFile?.("/data/saves/" + save);

            if (saveFile) {
                const renamedFile = new File([saveFile], saveName);

                emulator?.uploadSaveOrSaveState?.(renamedFile);
            } else {
                console.error("Unable to retrieve save file.");
            }
        }
    };

    const handleFileUpload = (file: File) => {
        const requiredString = `${gameData.cartID}_${checksum1000String}`;

        // Check if the file name already includes the required identifier
        let fileName = file.name;
        if (!fileName.includes(requiredString)) {
            const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
            const baseName = fileName.substring(0, fileName.lastIndexOf('.'));

            // Insert `gameData.cartID + "_" + checksum1000String` before the file extension
            fileName = `${baseName}_${requiredString}${fileExtension}`;
        }

        // Create a new file with the updated name if it was modified
        const newFile = new File([file], fileName);

        setUploadedSave(newFile);
        setSelectedSave(newFile.name);
        emulator?.uploadSaveOrSaveState?.(newFile);

        const renamedFile = new File([file], saveName);
        emulator?.uploadSaveOrSaveState?.(renamedFile);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const localSaves = emulator?.listSaves?.().filter(save => save.includes(gameData.cartID + "_" + checksum1000String)) || [];

    useEffect(() => {
        if(!window.hasRun){
            console.log("start1");
            for (const entry of localSaves) {
                if (saveName === entry) {
                    setSelectedSave(entry);
                    break;
                }
            }
            window.hasRun = true;
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
                        {selectedSave === "Cartridge Save" && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <TextField
                                        label="Cartridge Save Name"
                                        variant="outlined"
                                        fullWidth
                                        value={cartridgeSaveName}
                                        onChange={(e) => setCartridgeSaveName(e.target.value)}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                        {localSaves.length > 0 && (
                            localSaves.map((save, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedSave === save}
                                            onChange={() => handleCheckboxChange(save)}
                                        />
                                    </TableCell>
                                    <TableCell>{save}</TableCell>
                                    <TableCell>{emulator?.getStatSaves?.(save).mtime.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                        {uploadedSave && (
                            <TableRow key="uploaded-save">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedSave === uploadedSave.name}
                                        onChange={() => handleCheckboxChange(uploadedSave.name)}
                                    />
                                </TableCell>
                                <TableCell>{uploadedSave.name}</TableCell>
                                <TableCell>Uploaded</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2} p={2} border="1px dashed grey" margin="0 auto" textAlign="center" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <Typography>Drag & Drop Save File Here or Select a File</Typography>
                <Button variant="contained" component="label" sx={{ mt: 1 }}>
                    Select Save File
                    <input type="file" hidden onChange={handleFileSelect} />
                </Button>
            </Box>
        </>
    );
};