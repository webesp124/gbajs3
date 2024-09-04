import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { useEmulatorContext } from '../../hooks/context.tsx';
import { useEffect } from 'react';

interface GameData {
    cartID: string;
}

interface GameSelectionTableProps {
    gameData: GameData;
    checksum1000String: string | null;
    selectedGame: string;
    setSelectedGame: (save: string) => void;
    romName: string;
}

export const GameSelectionTable: React.FC<GameSelectionTableProps> = ({ gameData, checksum1000String, selectedGame, setSelectedGame, romName }) => {
    const { emulator } = useEmulatorContext();

    const handleCheckboxChange = (game: string) => {
        setSelectedGame(game);
    };

    const localGames = emulator?.listRoms?.().filter(game => game.includes(gameData.cartID + "_" + checksum1000String)) || [];

    useEffect(() => {
        for (const entry of localGames) {
            if (romName === entry) {
                setSelectedGame(entry);
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
                            <TableCell>Rom File</TableCell>
                            <TableCell>Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key="cartridge-game">
                            <TableCell>
                                <Checkbox
                                    checked={selectedGame === "Cartridge Rom"}
                                    onChange={() => handleCheckboxChange("Cartridge Rom")}
                                />
                            </TableCell>
                            <TableCell>Cartridge Rom</TableCell>
                            <TableCell>-</TableCell>
                        </TableRow>
                        {localGames.length > 0 ? (
                            localGames.map((game, index) => (
                                <TableRow 
                                key={index}
                                sx={{ borderBottom: index === localGames.length - 1 ? 'none' : undefined }}
                                >
                                    <TableCell sx={{ borderBottom: index === localGames.length - 1 ? 'none' : undefined }}>
                                        <Checkbox
                                            checked={selectedGame === game}
                                            onChange={() => handleCheckboxChange(game)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: index === localGames.length - 1 ? 'none' : undefined }}>{game}</TableCell>
                                    <TableCell sx={{ borderBottom: index === localGames.length - 1 ? 'none' : undefined }}>{emulator?.getStatRoms?.(game).mtime.toLocaleString()}</TableCell>
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
