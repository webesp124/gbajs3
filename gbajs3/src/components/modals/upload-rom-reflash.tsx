import { Button } from '@mui/material';
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

type InputProps = {
  romFile: File;
};

type RomLoadingIndicatorProps = {
  isLoading: boolean;
  children: ReactNode;
  indicator: ReactNode;
  progress: number;
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

const validFileExtensions = ['.gba', '.gbc', '.gb', '.zip', '.7z'];

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
  progress
}: RomLoadingIndicatorProps) => {
  return isLoading ? (
    <RomLoadingContainer>
      <URLDisplay>
        {progress < 4 ? "Erasing Sectors..." : progress > 67 ? "Verifying ROM..." : "Flashing new ROM to cartridge..."}
      </URLDisplay>
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
  const { setIsModalOpen } = useModalContext();
  const {
    handleSubmit,
    setValue,
    reset,
    control
  } = useForm<InputProps>();
  const {
    data: romWriteData,
    isLoading: isRomFlashing,
    error: reflashCartridgeError,
    execute: executeReflashCartridge,
    progress: reflashCartridgeProgress
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
    console.log(romWriteData);
    if (romFile) {
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
          >
          {!!reflashCartridgeError && (
            <ErrorWithIcon
              icon={<BiError style={{ color: theme.errorRed }} />}
              text="Writing rom has failed"
            />
          )}

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
                    Drag and drop a rom or zipped rom file here, or click to
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
        <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
