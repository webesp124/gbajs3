import { styled } from '@mui/material/styles';

import { ModalBody } from './modal-body.tsx';
import { ModalHeader } from './modal-header.tsx';
import { ReaderSetupContent } from '../reader-setup/reader-setup.tsx';

const SetupBody = styled(ModalBody)`
  max-height: calc(90dvh - 73px);
`;

export const ReaderSetupModal = () => {
  return (
    <>
      <ModalHeader title="NetBoy Network Setup" />
      <SetupBody>
        <ReaderSetupContent />
      </SetupBody>
    </>
  );
};
