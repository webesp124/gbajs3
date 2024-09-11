import { Button, TextField, Select, MenuItem, InputLabel, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useId, useState, useEffect } from 'react';

import { ModalBody } from './modal-body.tsx';
import { ModalFooter } from './modal-footer.tsx';
import { ModalHeader } from './modal-header.tsx';
import { useEmulatorContext, useModalContext } from '../../hooks/context.tsx';
import { CircleCheckButton } from '../shared/circle-check-button.tsx';

import { saveTypes } from './util-rom.tsx';
import * as bps from 'bps';
import { GameSelectionTable } from './game-selection-table.tsx';
import * as CRC32 from "crc-32";

export const CreatePatchFileModal = () => {
  const { setIsModalOpen } = useModalContext();
  const { emulator } = useEmulatorContext();

  const fields = [
    { label: 'Full Name', value: 'fullName', setter: 'setFullName' },
    { label: 'Cover Image', value: 'coverImage', setter: 'setCoverImage' },
    { label: 'Publisher', value: 'publisher', setter: 'setPublisher' },
    { label: 'Release Date', value: 'releaseDate', setter: 'setReleaseDate' },
    { label: 'CRC', value: 'crc', setter: 'setCrc' },
    { label: 'Cart Size (Bytes)', value: 'cartSize', setter: 'setCartSize' },
    { label: 'Save Type', value: 'saveType', setter: 'setSaveType' },
    { label: 'Checksum 1000', value: 'checksum1000', setter: 'setChecksum1000' },
    { label: 'Cart ID', value: 'cartId', setter: 'setCartId' },
    { label: 'Patch File', value: 'patchFile', setter: 'setPatchFile' },
    { label: 'Console', value: 'console', setter: 'setConsole' },
  ];

  const [formValues, setFormValues] = useState({
    fullName: '',
    coverImage: '',
    publisher: '',
    releaseDate: '',
    crc: '',
    cartSize: '',
    saveType: '',
    checksum1000: '',
    cartId: '',
    patchFile: '',
    console: '.gba'
  });

  const [baseRomFileName, setBaseRomFileName] = useState("");
  const [patchedRomFileName, setPatchedRomFileName] = useState("");
  const [patchedRomFileData, setPatchedRomFileData] = useState(new Uint8Array);

  useEffect(() => {
    if (baseRomFileName) {
        useFile(baseRomFileName);
    }
  }, [
    baseRomFileName
  ]);

  // Handler for file selection
  const handleFileChange = (event: { target: { name: any; value: any; files: any; }; }) => {
    const file = event.target.files[0];
    if (file) {
        setPatchedRomFileName(file.name);

        let fullName = removeExtension(file.name).fileName;
        setFormValues((prevValues) => ({
            ...prevValues,
            fullName: fullName
        }));

        setFormValues((prevValues) => ({
            ...prevValues,
            patchFile: fullName + ".bps"
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
            if(e.target && e.target.result) {
                let arrayBuffer = e.target.result;
                if (typeof arrayBuffer === 'string') {
                    // Convert string to ArrayBuffer
                    const encoder = new TextEncoder();
                    arrayBuffer = encoder.encode(arrayBuffer);
                }
                setPatchedRomFileData(new Uint8Array(arrayBuffer));
            }
        };
        reader.readAsArrayBuffer(file);
    }
  };

  const handleChange = (event: { target: { name: any; value: any; }; }, key: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value
    }));
  };

  const baseId = useId();

  function removeExtension(fileName: string) {
    const match = fileName.match(/\.(gb|gbc|gba)$/i);
    
    if (match) {
      return {
        fileName: fileName.replace(/\.(gb|gbc|gba)$/i, ''),
        removedExtension: match[0]
      };
    } else {
      return {
        fileName: fileName,
        removedExtension: "gba"
      };
    }
  }

  // Function to fetch and display game information
  const fetchGameInfo = async (cartId: string) => {
        const additionalResponse = await fetch(`./information_rom/${cartId}.json`);
        let additionalData = await additionalResponse.json();

        setFormValues((prevValues) => ({
            ...prevValues,
            coverImage: additionalData["coverImage"]
        }));

        setFormValues((prevValues) => ({
            ...prevValues,
            publisher: additionalData["publisher"]
        }));

        setFormValues((prevValues) => ({
            ...prevValues,
            releaseDate: additionalData["releaseDate"]
        }));

        setFormValues((prevValues) => ({
            ...prevValues,
            saveType: additionalData["saveType"]
        }));
  };

  const downloadJson = () => {
    const jsonData = {
        fullName: formValues["fullName"],
        coverImage: formValues["coverImage"],
        publisher: formValues["publisher"],
        releaseDate: formValues["releaseDate"],
        crc: formValues["crc"],
        cartSize: formValues["cartSize"],
        saveType: formValues["saveType"],
        checksum1000: formValues["checksum1000"],
        patchFile: "./patches/" + formValues["patchFile"],
        console: formValues["console"],
    };

    const jsonString = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = formValues["checksum1000"] + "-" + formValues["cartId"] + ".json";

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  };

  const useFile = (path: string) => {
    const fileName = path.split('/').pop();

    if (fileName) {
        setFormValues((prevValues) => ({
            ...prevValues,
            console: removeExtension(fileName).removedExtension
        }));

        setFormValues((prevValues) => ({
            ...prevValues,
            cartSize: emulator?.getStatRoms?.(path).size
        }));

        const regex = /_([A-Z0-9]{1,4})_([A-Z0-9]{1,8})\./;

        const match = fileName.match(regex);

        if (!match) {
            console.log("No match found");
            return;
        }

        const cartID = match[1];
        const checksum1000 = match[2];

        console.log("CartID:", cartID);
        console.log("Checksum1000:", checksum1000);

        setFormValues((prevValues) => ({
            ...prevValues,
            checksum1000: checksum1000
        }));

        setFormValues((prevValues) => ({
            ...prevValues,
            cartId: cartID
        }));

        const file = emulator?.getFile("/data/games/" + path);
        if (file){
            let crc32 = (CRC32.buf(file)>>>0).toString(16).toUpperCase();

            setFormValues((prevValues) => ({
                ...prevValues,
                crc: crc32
            }));
        }

        fetchGameInfo(cartID);
    }
  };

  const createPatchFile = () => {
    const originalFile = emulator?.getFile("/data/games/" + baseRomFileName);
    const newFile = patchedRomFileData;

    if (originalFile && newFile) {
        const instructions = bps.build(
            originalFile,
            newFile
        );
        const {
            buffer,
            checksum
        } = bps.serialize(instructions);

        console.log("Patch Checksum: " + checksum)

        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = formValues["patchFile"]; // Set the filename

        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);

        downloadJson();
    }
  };

  return (
    <>
      <ModalHeader title="File System" />
      <ModalBody>
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Base Rom</Divider>
        <GameSelectionTable gameData={null} checksum1000String={null} selectedGame={baseRomFileName} setSelectedGame={setBaseRomFileName} romName={".gba"} />
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Patched Rom</Divider>
        <input type="file" onChange={handleFileChange} accept=".gba" />
        {patchedRomFileName && <p>Selected File: {patchedRomFileName}</p>}

        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Information</Divider>
        {fields.map((field) => (
            field.value != 'saveType' ? (
                <TextField
                key={field.value}
                label={field.label}
                variant="filled"
                style={{ padding: '3px 8px 3px 8px', fontSize: '14px', marginLeft: '5px', width: "98%" }}
                value={formValues[field.value as keyof typeof formValues]}
                onChange={(event) => handleChange(event, field.value)}
                />
            ) : null
        ))}

        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth style={{ padding: '3px 8px 3px 8px', marginLeft: '5px', width: "98%", marginTop: '5px' }}>
                <InputLabel id="demo-simple-select-label">Save Type</InputLabel>
                <Select
                    name="saveType"
                    value={formValues["saveType"]}
                    onChange={(event) => handleChange(event, "saveType")}
                    label="Save Type"
                    style={{ fontSize: '14px'}}
                >
                    {saveTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                        {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
      </ModalBody>
      <ModalFooter>
        <CircleCheckButton
          copy="Create Patch File"
          id={`${baseId}--create-patch-button-button`}
          onClick={() => createPatchFile()}
        />
        <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
