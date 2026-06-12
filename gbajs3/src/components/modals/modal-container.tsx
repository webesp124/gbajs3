import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Modal from 'react-modal';

import { LazyModalContent } from './modal-container/lazy-modal-content.tsx';
import { useEmulatorContext, useModalContext } from '../../hooks/context.tsx';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(2, 6, 23, 0.72)',
    zIndex: 400
  },
  content: {
    width: 'calc(100dvw - 20px)',
    height: 'fit-content',
    margin: '25px auto auto auto',
    backgroundColor: '#0c1121',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    boxShadow:
      '0 10px 30px rgba(2, 6, 23, 0.64), 0 2px 8px rgba(2, 6, 23, 0.48)',
    inset: '10px',
    maxWidth: '500px',
    padding: '0',
    maxHeight: '90dvh',
    display: 'flex',
    touchAction: 'none',
    flexDirection: 'column' as const,
    userSelect: 'text' as const,
    WebkitUserSelect: 'text' as const
  }
};

const landscapeModalStyles = {
  ...modalStyles,
  content: {
    ...modalStyles.content,
    margin: '5px auto auto auto'
  }
};

export const ModalContainer = () => {
  const { modal, isModalOpen, closeModal, clearModal } = useModalContext();
  const { emulator } = useEmulatorContext();
  const theme = useTheme();
  const isMobileLandscape = useMediaQuery(theme.isMobileLandscape);
  const activeModalStyles =
    modal?.type === 'readerSetup' || modal?.type === 'readerFirmwareUpdate'
      ? {
          ...(isMobileLandscape ? landscapeModalStyles : modalStyles),
          content: {
            ...(isMobileLandscape
              ? landscapeModalStyles.content
              : modalStyles.content),
            maxWidth: '920px'
          }
        }
      : isMobileLandscape
        ? landscapeModalStyles
        : modalStyles;

  return (
    <Modal
      appElement={document.getElementById('root') ?? undefined}
      closeTimeoutMS={400}
      isOpen={isModalOpen}
      style={activeModalStyles}
      onRequestClose={closeModal}
      onAfterOpen={emulator?.disableKeyboardInput}
      onAfterClose={() => {
        clearModal();
        emulator?.enableKeyboardInput();
      }}
      aria={{ labelledby: 'modalHeader' }}
    >
      <LazyModalContent modal={modal} />
    </Modal>
  );
};
