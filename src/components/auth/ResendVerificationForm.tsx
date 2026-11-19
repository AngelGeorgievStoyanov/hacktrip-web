'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { authApi } from '@/api/auth';
import type { ResendVerificationInput } from '@/api/auth';
import { zodResolver } from '@/lib/zodResolver';
import { getGenericErrorMessage } from '@/lib/errors';
import { resendVerificationSchema } from '@/validations/auth';
import { useNotification } from '@/components/common/NotificationProvider';
import { Captcha } from '@/components/auth/Captcha';
import { RESEND_VERIFICATION_SUCCESS_MESSAGE } from '@/constants/notifications';
import { AUTH_FORM_BACK_ACTION_SX, AUTH_FORM_BACK_BUTTON_SX, AUTH_FORM_SX, AUTH_FORM_TITLE_SX } from '@/styles/presets/forms';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { UI_SIZES } from '@/constants/ui/sizes';
import { WelcomeHeading } from '@/components/common/WelcomeHeading';
import { BackButton } from '@/components/common/BackButton';

export function ResendVerificationForm() {
  const notification = useNotification();
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: '', captchaToken: '' },
  });

  async function onSubmit(values: ResendVerificationInput): Promise<void> {
    setSubmitting(true);
    try {
      await authApi.resendVerification({ ...values, captchaToken });
      notification.success(RESEND_VERIFICATION_SUCCESS_MESSAGE);
    } catch (error) {
      notification.error(getGenericErrorMessage(error));
    } finally {
      setSubmitting(false);
      setCaptchaToken('');
      setValue('captchaToken', '', { shouldValidate: true });
      setCaptchaResetKey((key) => key + 1);
    }
  }

  return (
    <WelcomeHeading>
      <Box
        component="form"
        noValidate
        aria-busy={submitting}
        onSubmit={handleSubmit(onSubmit)}
        sx={AUTH_FORM_SX}
      >
        <Typography variant="h5" component="h1" sx={AUTH_FORM_TITLE_SX}>
          RESEND VERIFICATION EMAIL
        </Typography>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={isSubmitted && !!errors.email}
          helperText={isSubmitted ? (errors.email?.message ?? ' ') : ' '}
        />
        <input type="hidden" {...register('captchaToken')} />
        <Captcha
          resetKey={captchaResetKey}
          disabled={submitting}
          onTokenChange={(token) => {
            setCaptchaToken(token);
            setValue('captchaToken', token, { shouldValidate: true });
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || !captchaToken}
          startIcon={submitting ? <CircularProgress size={UI_SIZES.smallIndicator} /> : undefined}
          sx={BUTTON_STYLES.primary}
        >
          Resend verification email
        </Button>
        <Box sx={AUTH_FORM_BACK_ACTION_SX}>
          <BackButton component={Link} href="/login" disabled={submitting} sx={AUTH_FORM_BACK_BUTTON_SX}>
            Back to login
          </BackButton>
        </Box>
      </Box>
    </WelcomeHeading>
  );
}
