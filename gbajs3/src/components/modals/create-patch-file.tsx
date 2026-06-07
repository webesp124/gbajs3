import { Button, TextField, Select, MenuItem, InputLabel, Divider, Typography } from '@mui/material';
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

type PatchMode = 'existingPatch' | 'generateBps';

export const CreatePatchFileModal = () => {
  const { closeModal } = useModalContext();
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
    { label: 'QoL Patch Files', value: 'compatibleImprovementPatchFiles', setter: 'setCompatibleImprovementPatchFiles' },
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
    compatibleImprovementPatchFiles: '',
    console: '.gba'
  });

  const [baseRomFileName, setBaseRomFileName] = useState("");
  const [patchMode, setPatchMode] = useState<PatchMode>('existingPatch');
  const [patchSourceFileName, setPatchSourceFileName] = useState("");
  const [patchedRomFileData, setPatchedRomFileData] = useState(new Uint8Array);

  useEffect(() => {
    if (baseRomFileName) {
        useFile(baseRomFileName);
    }
  }, [
    baseRomFileName
  ]);

  const setPatchFileNameFromUpload = (fileName: string, extension: string) => {
    const fullName = removeExtension(fileName).fileName;
    setPatchSourceFileName(fileName);

    setFormValues((prevValues) => ({
      ...prevValues,
      fullName,
      patchFile: `${fullName}${extension}`
    }));
  };

  // Handler for patched ROM selection. This generates a new BPS patch.
  const handlePatchedRomChange = (event: { target: { name: any; value: any; files: any; }; }) => {
    const file = event.target.files[0];
    if (file) {
        setPatchFileNameFromUpload(file.name, ".bps");

        const reader = new FileReader();
        reader.onload = (e) => {
            if(e.target && e.target.result) {
                const result = e.target.result;
                const bytes =
                    typeof result === 'string'
                        ? new TextEncoder().encode(result)
                        : new Uint8Array(result);
                setPatchedRomFileData(bytes);
            }
        };
        reader.readAsArrayBuffer(file);
    }
  };

  // Handler for existing patch selection. This only writes JSON metadata.
  const handleExistingPatchChange = (event: { target: { name: any; value: any; files: any; }; }) => {
    const file = event.target.files[0];
    if (!file) return;

    const extensionMatch = file.name.match(/\.(ips|bps|txt)$/i);
    setPatchSourceFileName(file.name);

    setFormValues((prevValues) => ({
      ...prevValues,
      patchFile: file.name,
      fullName: prevValues.fullName || removeExtension(file.name).fileName
    }));

    if (!extensionMatch) {
      console.warn('Unsupported patch extension selected:', file.name);
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
    const match = fileName.match(/\.(gb|gbc|gba|ips|bps|txt)$/i);
    
    if (match) {
      return {
        fileName: fileName.replace(/\.(gb|gbc|gba|ips|bps|txt)$/i, ''),
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
    const compatibleImprovementPatchFiles = formValues["compatibleImprovementPatchFiles"]
      .split(/\r?\n|,/)
      .map((patchFile) => patchFile.trim())
      .filter((patchFile) => patchFile.length > 0);

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
        ...(compatibleImprovementPatchFiles.length > 0
          ? { compatibleImprovementPatchFiles }
          : {}),
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
            cartSize: String(emulator?.getStatRoms?.(path).size ?? '')
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
    if (patchMode === 'existingPatch') {
      downloadJson();
      return;
    }

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

        const blob = new Blob([buffer as BlobPart], { type: 'application/octet-stream' });

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
      <ModalHeader title="Patch/JSON Builder" />
      <ModalBody>
        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Base Rom</Divider>
        <GameSelectionTable gameData={null} checksum1000String={null} selectedGame={baseRomFileName} setSelectedGame={setBaseRomFileName} romName={".gba"} />

        <Divider sx={{ padding: '10px 0', color: 'darkgrey' }}>Patch Source</Divider>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth style={{ padding: '3px 8px 3px 8px', marginLeft: '5px', width: "98%", marginTop: '5px' }}>
            <InputLabel id="patch-source-mode-label">Patch Source</InputLabel>
            <Select
              labelId="patch-source-mode-label"
              value={patchMode}
              onChange={(event) => {
                setPatchMode(event.target.value as PatchMode);
                setPatchSourceFileName("");
                setPatchedRomFileData(new Uint8Array());
                setFormValues((prevValues) => ({
                  ...prevValues,
                  patchFile: ''
                }));
              }}
              label="Patch Source"
              style={{ fontSize: '14px'}}
            >
              <MenuItem value="existingPatch">Use existing patch file (.ips, .bps, .txt)</MenuItem>
              <MenuItem value="generateBps">Generate BPS from patched ROM</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {patchMode === 'existingPatch' ? (
          <>
            <Typography variant="body2" sx={{ padding: '8px 8px 0 13px' }}>
              Select the patch file that will be referenced by the generated JSON.
            </Typography>
            <input type="file" onChange={handleExistingPatchChange} accept=".ips,.bps,.txt" />
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ padding: '8px 8px 0 13px' }}>
              Select the already-patched ROM. netBOY will compare it with the base ROM and download a new BPS patch.
            </Typography>
            <input type="file" onChange={handlePatchedRomChange} accept=".gba,.gb,.gbc" />
          </>
        )}
        {patchSourceFileName && <p>Selected File: {patchSourceFileName}</p>}

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
                helperText={field.value === 'compatibleImprovementPatchFiles'
                  ? 'Optional. Enter one QoL patch path per line or separate multiple paths with commas.'
                  : undefined}
                multiline={field.value === 'compatibleImprovementPatchFiles'}
                minRows={field.value === 'compatibleImprovementPatchFiles' ? 2 : undefined}
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
          copy={patchMode === 'existingPatch' ? 'Create JSON' : 'Create BPS + JSON'}
          id={`${baseId}--create-patch-button-button`}
          onClick={() => createPatchFile()}
        />
        <Button variant="outlined" onClick={closeModal}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
