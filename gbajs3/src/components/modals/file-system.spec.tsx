import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileSystemModal } from './file-system.tsx';
import { renderWithContext } from '../../../test/render-with-context.tsx';
import * as contextHooks from '../../hooks/context.tsx';
import { productTourLocalStorageKey } from '../product-tour/consts.tsx';

import type {
  FileNode,
  GBAEmulator
} from '../../emulator/mgba/mgba-emulator.tsx';

describe('<FileSystemModal />', () => {
  const defaultFSData: FileNode = {
    path: '/data',
    isDir: true,
    children: [
      {
        path: '/data/games',
        isDir: true,
        children: [
          {
            path: '/data/games/rom1.gba',
            isDir: false,
            children: []
          }
        ]
      }
    ]
  };

  it('renders main sections', async () => {
    const { useEmulatorContext: original } = await vi.importActual<
      typeof contextHooks
    >('../../hooks/context.tsx');

    vi.spyOn(contextHooks, 'useEmulatorContext').mockImplementation(() => {
      return {
        ...original(),
        emulator: {
          listAllFiles: () => defaultFSData
        } as GBAEmulator
      };
    });

    renderWithContext(<FileSystemModal />);

    // emulator file system
    expect(screen.getByLabelText('File System')).toBeVisible();
    // file system options
    expect(screen.getByRole('button', { name: 'Options' })).toBeVisible();
    // action buttons
    expect(
      screen.getByRole('button', { name: 'Save File System' })
    ).toBeVisible();
    expect(screen.getByText('Close', { selector: 'button' })).toBeVisible();
  });

  it('deletes file from the tree', async () => {
    const deleteFileSpy: (p: string) => void = vi.fn();
    const listAllFilesSpy = vi.fn(() => defaultFSData);
    const { useEmulatorContext: original } = await vi.importActual<
      typeof contextHooks
    >('../../hooks/context.tsx');

    vi.spyOn(contextHooks, 'useEmulatorContext').mockImplementation(() => {
      return {
        ...original(),
        emulator: {
          listAllFiles: listAllFilesSpy as () => FileNode,
          deleteFile: deleteFileSpy
        } as GBAEmulator
      };
    });

    renderWithContext(<FileSystemModal />);

    listAllFilesSpy.mockClear(); // clear calls from initial render

    await userEvent.click(screen.getByText('games'));
    await userEvent.click(screen.getByLabelText('Delete rom1.gba'));

    expect(deleteFileSpy).toHaveBeenCalledOnce();
    expect(deleteFileSpy).toHaveBeenCalledWith('/data/games/rom1.gba');
    expect(listAllFilesSpy).toHaveBeenCalledOnce();
  });

  it('downloads file from the tree', async () => {
    const getFileSpy: (p: string) => Uint8Array = vi.fn(() =>
      new TextEncoder().encode('Some state file contents')
    );
    const { useEmulatorContext: original } = await vi.importActual<
      typeof contextHooks
    >('../../hooks/context.tsx');

    // unimplemented in jsdom
    URL.createObjectURL = vi.fn(() => 'object_url:some_rom.sav');
    // mock to assert click and prevent navigation (unimplemented)
    const anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockReturnValue();
    const anchorRemoveSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove');

    vi.spyOn(contextHooks, 'useEmulatorContext').mockImplementation(() => {
      return {
        ...original(),
        emulator: {
          listAllFiles: () => defaultFSData,
          getFile: getFileSpy
        } as GBAEmulator
      };
    });

    renderWithContext(<FileSystemModal />);

    await userEvent.click(screen.getByText('games'));
    await userEvent.click(screen.getByLabelText('Download rom1.gba'));

    expect(getFileSpy).toHaveBeenCalledOnce();
    expect(getFileSpy).toHaveBeenCalledWith('/data/games/rom1.gba');

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.anything());
    expect(anchorClickSpy).toHaveBeenCalledOnce();
    expect(anchorRemoveSpy).toHaveBeenCalledOnce();
  });

  it('saves file system', async () => {
    const emulatorFSSyncSpy: () => void = vi.fn();
    const { useEmulatorContext: original } = await vi.importActual<
      typeof contextHooks
    >('../../hooks/context.tsx');

    vi.spyOn(contextHooks, 'useEmulatorContext').mockImplementation(() => ({
      ...original(),
      emulator: {
        listAllFiles: () => defaultFSData,
        fsSync: emulatorFSSyncSpy
      } as GBAEmulator
    }));

    renderWithContext(<FileSystemModal />);

    const saveFileSystemButton = screen.getByRole('button', {
      name: 'Save File System'
    });

    expect(saveFileSystemButton).toBeVisible();

    await userEvent.click(saveFileSystemButton);

    expect(emulatorFSSyncSpy).toHaveBeenCalledOnce();
  });

  it('closes modal using the close button', async () => {
    const setIsModalOpenSpy = vi.fn();
    const { useModalContext: original } = await vi.importActual<
      typeof contextHooks
    >('../../hooks/context.tsx');

    vi.spyOn(contextHooks, 'useModalContext').mockImplementation(() => ({
      ...original(),
      setIsModalOpen: setIsModalOpenSpy
    }));

    renderWithContext(<FileSystemModal />);

    // click the close button
    const closeButton = screen.getByText('Close', { selector: 'button' });
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);

    expect(setIsModalOpenSpy).toHaveBeenCalledWith(false);
  });

  it('renders tour steps', async () => {
    const {
      useModalContext: originalModal,
      useEmulatorContext: originalEmulator
    } = await vi.importActual<typeof contextHooks>('../../hooks/context.tsx');

    vi.spyOn(contextHooks, 'useEmulatorContext').mockImplementation(() => {
      return {
        ...originalEmulator(),
        emulator: {
          listAllFiles: () => defaultFSData
        } as GBAEmulator
      };
    });

    vi.spyOn(contextHooks, 'useModalContext').mockImplementation(() => ({
      ...originalModal(),
      isModalOpen: true
    }));

    localStorage.setItem(
      productTourLocalStorageKey,
      '{"hasCompletedProductTourIntro":"finished"}'
    );

    renderWithContext(<FileSystemModal />);

    expect(
      await screen.findByText(
        'Use this area to view your current file tree, download files, and delete files from the tree.'
      )
    ).toBeInTheDocument();

    // click joyride floater
    await userEvent.click(
      screen.getByRole('button', { name: 'Open the dialog' })
    );

    expect(
      screen.getByText(
        'Use this area to view your current file tree, download files, and delete files from the tree.'
      )
    ).toBeVisible();

    // advance tour
    await userEvent.click(screen.getByRole('button', { name: /Next/ }));

    expect(
      screen.getByText(
        (_, element) =>
          element?.nodeName === 'P' &&
          element?.textContent ===
            'Click the Options label to adjust and save settings related to the file system.'
      )
    ).toBeVisible();

    // advance tour
    await userEvent.click(screen.getByRole('button', { name: /Next/ }));

    expect(
      screen.getByText(
        (_, element) =>
          element?.nodeName === 'P' &&
          element?.textContent ===
            'Use the SAVE FILE SYSTEM button to persist all of your files to your device!'
      )
    ).toBeVisible();
  });
});
