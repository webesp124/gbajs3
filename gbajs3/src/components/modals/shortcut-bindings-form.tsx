import React from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { saveShortcuts, resetShortcuts, loadShortcuts } from '../controls/shortcuts';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type ShortcutBindingsFormProps = {
  id: string;
  onAfterSubmit: () => void;
};

type ShortcutKeys = {
  fastForward: string;
  autoFireA: string;
  autoFireB: string;
  uploadSave: string;
  quickReload: string;
  quickLoad: string;
  quickSave: string;
};

export const ShortcutBindingsForm: React.FC<ShortcutBindingsFormProps> = ({
  id,
  onAfterSubmit
}) => {
  const [shortcuts, setShortcuts] = useLocalStorage<ShortcutKeys | undefined>('custom_shortcuts', loadShortcuts());

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ShortcutKeys>({
    defaultValues: shortcuts,
    resetOptions: {
      keepDirtyValues: true
    }
  });

  const onSubmit: SubmitHandler<ShortcutKeys> = async (formData) => {
    setShortcuts(formData);
    saveShortcuts(formData);
    onAfterSubmit();
  };

  const handleReset = () => {
    resetShortcuts();
    reset(loadShortcuts());
  };

  return (
    <StyledForm
      aria-label="Shortcut Bindings Form"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      {Object.keys(shortcuts || {}).map((key) => (
        <Controller
          key={`shortcut_${key}`}
          control={control}
          name={key as keyof ShortcutKeys}
          defaultValue={(shortcuts || {})[key as keyof ShortcutKeys]}
          rules={{
            validate: {
              noSpace: (value) =>
                value !== ' ' || 'Space is reserved for accessibility requirements',
              noTab: (value) =>
                value?.toLowerCase() !== 'tab' || 'Tab is reserved for accessibility requirements'
            }
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              variant="outlined"
              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              value={value}
              onKeyDown={(keyboardEvent) => {
                if (keyboardEvent.key.toLowerCase() === 'tab') return;

                onChange(keyboardEvent.key);
                keyboardEvent.preventDefault();
              }}
              error={!!errors[key as keyof ShortcutKeys]}
              helperText={errors?.[key as keyof ShortcutKeys]?.message}
              fullWidth
            />
          )}
        />
      ))}
      
      <Button onClick={handleReset} style={{ marginTop: '8px', alignSelf: 'flex-start', width: 'auto' }}>
        Reset to Default
      </Button>
    </StyledForm>
  );
};