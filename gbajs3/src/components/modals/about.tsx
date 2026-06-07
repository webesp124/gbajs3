import { Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BiCheckCircle } from 'react-icons/bi';

import { ModalBody } from './modal-body.tsx';
import { ModalFooter } from './modal-footer.tsx';
import { ModalHeader } from './modal-header.tsx';
import { useModalContext } from '../../hooks/context.tsx';

const FlexWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const AboutModal = () => {
  const { closeModal } = useModalContext();
  const releaseVersion = import.meta.env.VITE_GBA_RELEASE_VERSION;

  return (
    <>
      <ModalHeader title="About" />
      <ModalBody>
        <p>
          netBOY is the browser interface for the netBOY wireless GBA cartridge
          reader. The cartridge reader hardware is required to read cartridges,
          download saves, upload saves, and reflash supported repro cartridges.
        </p>
        <p>
          The app can also run compatible Game Boy Advance games in the browser
          using the mGBA WebAssembly core after a ROM has been loaded from the
          reader or from local storage.
        </p>
        <p>Getting Started:</p>
        <ul>
          <li>Power on the netBOY wireless cartridge reader and insert a game</li>
          <li>
            Enter the reader address on the start page, or open the app from the
            reader page so the address is filled automatically
          </li>
          <li>Use <i>My Cartridge</i> to detect the inserted cartridge</li>
          <li>
            Download the cartridge ROM and save file before playing or writing
            data back to the cartridge
          </li>
        </ul>
        <p>
          See the project{' '}
          <a href="https://github.com/thenick775/gbajs3/wiki" target="_blank">
            WIKI
          </a>{' '}
          for firmware setup, browser requirements, and cartridge compatibility
          notes.
        </p>
        {releaseVersion && (
          <FlexWrapper>
            <Chip
              label={`Version ${releaseVersion}`}
              component="a"
              target="_blank"
              href={`https://github.com/thenick775/gbajs3/releases/tag/${releaseVersion}`}
              size="small"
              icon={<BiCheckCircle />}
              clickable
            />
          </FlexWrapper>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="outlined" onClick={closeModal}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
