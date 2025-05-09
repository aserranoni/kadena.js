import { config } from '@/config';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { walletRepository } from '@/modules/wallet/wallet.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { MonoCheck } from '@kadena/kode-icons/system';
import { Button, Notification, Stack, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ProfileForm {
  name: string;
  color: string;
}

export function ProfileNameColorForm({ isOpen }: { isOpen: boolean }) {
  const { profile, profileList } = useWallet();
  const {
    register,
    reset,
    trigger,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<ProfileForm>({
    mode: 'onChange',
    defaultValues: {
      name: profile?.name ?? '',
      color: profile?.accentColor ?? '',
    },
  });

  const { setIsRightAsideExpanded } = useSideBarLayout();
  const [error, setError] = useState<string | null>(null);

  // hack to do a form validation after load
  // This is not supported by react-hook-form
  useEffect(() => {
    console.log('profileList', profileList);
    reset();
    setTimeout(() => {
      trigger();
    }, 100);
  }, [reset, trigger, profileList]);

  async function onSubmit(data: ProfileForm) {
    const { name, color } = data;
    setError(null);
    await walletRepository.updateProfile({
      ...profile!,
      name,
      accentColor: color,
    });
    setIsRightAsideExpanded(false);
  }

  return (
    <RightAside isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RightAsideHeader label="Profile Name and Color" />
        <RightAsideContent>
          <Stack width="100%" flexDirection="column" gap="md">
            <TextField
              autoFocus
              label="Profile Name"
              placeholder="Enter profile name"
              defaultValue={profile?.name}
              isInvalid={!!errors['name']}
              errorMessage={errors['name']?.message}
              {...register('name', {
                required: {
                  value: true,
                  message: 'This field is required',
                },
                maxLength: {
                  value: 25,
                  message: 'The max length is 25 characters',
                },
                validate: {
                  required: (value) => {
                    const existingProfile = profileList.find(
                      (p) => p.name === value && p.name !== profile?.name,
                    );
                    if (existingProfile)
                      return `The profile name ${value} already exists. Please use another name.`;
                    return true;
                  },
                },
              })}
            />
            <Label size="small" bold>
              Accent Color
            </Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <Stack gap="sm" flexWrap="wrap">
                  {config.colorList.map((color) => (
                    <Button
                      key={color}
                      variant="outlined"
                      onPress={() => field.onChange(color)}
                      style={{
                        backgroundColor: color,
                        color: 'white',
                        borderRadius: 50,
                      }}
                    >
                      <div style={{ width: 25, height: 25 }}>
                        {field.value === color ? <MonoCheck /> : null}
                      </div>
                    </Button>
                  ))}
                </Stack>
              )}
            ></Controller>
            {error && <Notification role="alert">{error}</Notification>}
          </Stack>
        </RightAsideContent>
        <RightAsideFooter>
          <Button
            variant="outlined"
            onPress={() => {
              setIsRightAsideExpanded(false);
            }}
            type="reset"
          >
            Cancel
          </Button>
          <Button isDisabled={!isValid} type="submit">
            Save
          </Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
}
