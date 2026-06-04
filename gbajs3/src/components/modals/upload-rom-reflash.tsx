import { Alert, Button, Typography } from '@mui/material';
import { useCallback, useId, type ReactNode } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { PacmanLoader } from 'react-spinners';
import { styled, useTheme } from 'styled-components';

import { ModalBody } from './modal-body.tsx';
import { ModalFooter } from './modal-footer.tsx';
import { ModalHeader } from './modal-header.tsx';
import { useLoadReflashRom } from '../../hooks/use-load-reflash-rom.tsx';
import { DragAndDropInput } from '../shared/drag-and-drop-input.tsx';
import { useModalContext } from '../../hooks/context.tsx';
import { ErrorWithIcon } from '../shared/error-with-icon.tsx';
import { BiError } from 'react-icons/bi';
import { createCartridgeSaveBackup } from '../../utils/save-backups.ts';
import { downloadReaderSave, explainReaderError } from '../../utils/reader-client.ts';
import { getSaveTypeCodeFromString } from './util-rom.tsx';

type InputProps = {
  romFile: File;
};

type RomLoadingIndicatorProps = {
  isLoading: boolean;
  children: ReactNode;
  indicator: ReactNode;
  progress: number;
  message?: string;
  etaSeconds?: number;
  bytesPerSecond?: number;
};

const RomLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
`;

const URLDisplay = styled.p`
  word-wrap: break-word;
  max-width: 100%;
`;

const validFileExtensions = ['.gba', '.gbc', '.gb'];

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  height: 24px;
  width: 100%;
  margin-top: 16px;
  overflow: hidden;

  &::after {
    content: '';
    background-color: ${props => props.theme.gbaThemeBlue};
    height: 100%;
    width: ${props => props.progress}%;
    position: absolute;
    left: 0;
    top: 0;
    transition: width 0.2s ease-in-out;
  }
`;

const RomLoadingIndicator = ({
  isLoading,
  children,
  indicator,
  progress,
  message,
  etaSeconds,
  bytesPerSecond
}: RomLoadingIndicatorProps) => {
  return isLoading ? (
    <RomLoadingContainer>
      <URLDisplay>
        {message ?? (progress < 4 ? "Erasing Sectors..." : progress > 67 ? "Verifying ROM..." : "Flashing new ROM to cartridge...")}
      </URLDisplay>
      {(bytesPerSecond || etaSeconds) && (
        <Typography variant="caption">
          {bytesPerSecond ? `${(bytesPerSecond / 1024).toFixed(1)} KB/s` : ''}
          {etaSeconds ? ` · ${Math.ceil(etaSeconds)}s remaining` : ''}
        </Typography>
      )}
      {indicator}
      <ProgressBar progress={progress}>
          <span style={{ position: 'relative', width: '100%', textAlign: 'center', zIndex: 600 }}>
            {Math.round(progress)}%
          </span>
        </ProgressBar>
    </RomLoadingContainer>
  ) : (
    children
  );
};

type UploadRomReflashPageProps = {
  esp32IP: string;
};

export const UploadRomReflashModal: React.FC<UploadRomReflashPageProps> = ({
  esp32IP,
  }) => {
  const theme = useTheme();
  const { closeModal } = useModalContext();
  const {
    handleSubmit,
    setValue,
    reset,
    control
  } = useForm<InputProps>();
  const {
    isLoading: isRomFlashing,
    error: reflashCartridgeError,
    execute: executeReflashCartridge,
    progress: reflashCartridgeProgress,
    readerProgress
  } = useLoadReflashRom();
  const uploadRomFormId = useId();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      reset();
      setValue('romFile', acceptedFiles[0], { shouldValidate: true });
    },
    [reset, setValue]
  );

  const onSubmit: SubmitHandler<InputProps> = async ({ romFile }) => {
    if (romFile) {
      const confirmed = window.confirm(
        [
          `Flash ${romFile.name} to the inserted cartridge?`,
          '',
          'This can overwrite the cartridge ROM. netBOY will try to back up the current save first.',
          'Keep the reader powered and do not remove the cartridge until verification finishes.',
          '',
          'If flashing fails, leave the cartridge inserted and retry with the same ROM before power-cycling the reader.'
        ].join('\n')
      );
      if (!confirmed) return;

      const gameData = window.gameData;
      const additionalData = window.additionalData;
      const isGba = gameData?.is_gba !== false;
      const saveType = isGba && additionalData?.saveType
        ? getSaveTypeCodeFromString(additionalData.saveType)
        : undefined;

      try {
        const backupData = await downloadReaderSave(
          esp32IP,
          saveType === -1 ? undefined : saveType,
          {
            timeoutMs: 90000,
            retries: 0
          }
        );
        createCartridgeSaveBackup(
          {
            name: `BeforeFlash_${additionalData?.fullName ?? gameData?.romName ?? 'cartridge'}.sav`,
            readerURL: esp32IP,
            gameName: additionalData?.fullName ?? gameData?.romName ?? 'Unknown cartridge',
            cartridgeType: isGba ? 'gba' : 'gb',
            saveType: isGba ? additionalData?.saveType : undefined
          },
          backupData
        );
      } catch (error) {
        const keepGoing = window.confirm(
          [
            'Could not back up the current cartridge save before flashing.',
            explainReaderError(error),
            '',
            'Continue flashing anyway?'
          ].join('\n')
        );
        if (!keepGoing) return;
      }

      await executeReflashCartridge({ romFile: romFile, esp32IP: esp32IP });
      return;
    }
  };

  return (
    <>
      <ModalHeader title="Upload Rom" />
      <ModalBody>
          <RomLoadingIndicator
            isLoading={isRomFlashing}
            indicator={
              <PacmanLoader
                color={theme.gbaThemeBlue}
                cssOverride={{ margin: '0 auto' }}
              />
            }
            progress={reflashCartridgeProgress}
            message={readerProgress?.message}
            etaSeconds={readerProgress?.etaSeconds}
            bytesPerSecond={readerProgress?.bytesPerSecond}
          >
          {!!reflashCartridgeError && (
            <ErrorWithIcon
              icon={<BiError style={{ color: theme.errorRed }} />}
              text={`Writing ROM has failed. ${explainReaderError(reflashCartridgeError)}`}
            />
          )}
          <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Reflash carefully</Typography>
            <Typography variant="body2">
              Back up saves first, keep the reader powered, and leave the cartridge inserted until verification finishes.
            </Typography>
          </Alert>

          <form
            id={uploadRomFormId}
            aria-label="Upload Rom Form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="romFile"
              rules={{
                validate: (rom) =>
                  !!rom ||
                  'A rom file is required'
              }}
              render={({ field: { name }, fieldState: { error } }) => (
                <DragAndDropInput
                  ariaLabel="Upload Rom"
                  id={`${uploadRomFormId}--drag-and-drop`}
                  onDrop={onDrop}
                  name={name}
                  validFileExtensions={validFileExtensions}
                  hideErrors={!!error}
                >
                  <p>
                    Drag and drop a .gba, .gb, or .gbc ROM file here, or click to
                    upload a file
                  </p>
                </DragAndDropInput>
              )}
            />
          </form>
        </RomLoadingIndicator>
      </ModalBody>
      <ModalFooter>
        <Button form={uploadRomFormId} type="submit" variant="contained">
          Reflash Repro
        </Button>
        <Button variant="outlined" onClick={closeModal}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
