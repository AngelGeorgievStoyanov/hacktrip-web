'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ProfileImage, ProfileImageUpload } from '@/components/auth/ProfileImage';
import { BackButton } from '@/components/common/BackButton';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import type { UpdateProfileInput } from '@/api/auth';
import { zodResolver } from '@/lib/zodResolver';
import { getGenericErrorMessage } from '@/lib/errors';
import { updateProfileSchema } from '@/validations/auth';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { useNotification } from '@/components/common/NotificationProvider';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import {
  PROFILE_FORM_SX,
  ACCOUNT_FORM_TITLE_SX,
  ACCOUNT_FORM_ACTIONS_SX,
  ACCOUNT_FORM_READONLY_FIELD_SX,
} from '@/styles/presets/forms';
import { UI_SIZES } from '@/constants/ui/sizes';

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const notification = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profileImageRefreshToken, setProfileImageRefreshToken] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  async function onSubmit(values: UpdateProfileInput): Promise<void> {
    setSubmitting(true);
    try {
      if (selectedImage) {
        await authApi.uploadProfileImage(selectedImage);
        setSelectedImage(null);
        setProfileImageRefreshToken((current) => current + 1);
      }
      const response = await authApi.updateProfile(values);
      updateUser(response.user);
      reset({ firstName: response.user.firstName, lastName: response.user.lastName });
      notification.success('Profile updated.');
    } catch (error) {
      notification.error(getGenericErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <ProfileImage refreshToken={profileImageRefreshToken} />
      <Box
        component="form"
        noValidate
        aria-busy={submitting}
        onSubmit={handleSubmit(onSubmit)}
        sx={PROFILE_FORM_SX}
      >
        <Typography variant="h5" component="h2" sx={ACCOUNT_FORM_TITLE_SX}>
          {user?.firstName ? `${user.firstName}'s  PROFILE` : 'PROFILE'}
        </Typography>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={user?.email ?? ''}
          disabled
          sx={ACCOUNT_FORM_READONLY_FIELD_SX}
        />
        <TextField
          label="First Name"
          autoComplete="given-name"
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          label="Last Name"
          autoComplete="family-name"
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <ProfileImageUpload selectedFile={selectedImage} onSelectedFileChange={setSelectedImage} />
        <Box sx={ACCOUNT_FORM_ACTIONS_SX}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || ((!isDirty || !isValid) && !selectedImage)}
            startIcon={submitting ? <CircularProgress size={UI_SIZES.smallIndicator} /> : undefined}
            sx={BUTTON_STYLES.edit}
          >
            EDIT PROFILE
          </Button>
          <BackButton onClick={() => router.back()}>BACK</BackButton>
          <Button
            variant="contained"
            onClick={() => setPasswordExpanded((current) => !current)}
            disabled={submitting}
            sx={BUTTON_STYLES.disclosure}
          >
            {passwordExpanded ? 'HIDE CHANGE PASSWORD' : 'CHANGE PASSWORD'}
          </Button>
        </Box>
      </Box>
      <ChangePasswordForm expanded={passwordExpanded} />
    </>
  );
}
