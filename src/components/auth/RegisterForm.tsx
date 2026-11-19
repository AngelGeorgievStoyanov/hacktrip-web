'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { z } from 'zod';
import { authApi } from '@/api/auth';
import type { RegisterInput } from '@/api/auth';
import { zodResolver } from '@/lib/zodResolver';
import { getGenericErrorMessage } from '@/lib/errors';
import { registerSchema } from '@/validations/auth';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { UI_SIZES } from '@/constants/ui/sizes';
import { AUTH_FORM_ACTIONS_SX, AUTH_FORM_SX, AUTH_FORM_TITLE_SX } from '@/styles/presets/forms';
import { WelcomeHeading } from '@/components/common/WelcomeHeading';
import { Captcha } from '@/components/auth/Captcha';
import { PasswordField } from '@/components/common/PasswordField';
import { PasswordRequirements } from '@/components/common/PasswordRequirements';
import { useNotification } from '@/components/common/NotificationProvider';
import styles from './RegisterForm.module.css';
import {
  AUTH_SUCCESS_REDIRECT_DELAY_MS,
  REGISTRATION_SUCCESS_MESSAGE,
} from '@/constants/notifications';

const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().trim().min(1, 'Confirm password is required.'),
    acceptedTerms: z.boolean().refine((accepted) => accepted, {
      message: 'You must accept the terms of use and privacy policy.',
    }),
  })
  .refine((values) => values.confirmPassword === values.password, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

type RegisterFormValues = z.input<typeof registerFormSchema>;

export function RegisterForm() {
  const notification = useNotification();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const isFormLocked = submitting || registrationComplete;

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  useEffect(() => {
    if (!registrationComplete) return;

    const redirectTimeout = window.setTimeout(
      () => router.replace('/login'),
      AUTH_SUCCESS_REDIRECT_DELAY_MS,
    );

    return () => window.clearTimeout(redirectTimeout);
  }, [registrationComplete, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted, isValid, touchedFields },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver<RegisterFormValues>(registerFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
      captchaToken: '',
    },
  });

  const password = watch('password') ?? '';
  const confirmPassword = watch('confirmPassword') ?? '';
  const confirmPasswordMismatch =
    confirmPassword.length > 0 && confirmPassword.trim() !== password.trim();

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setSubmitting(true);
    try {
      const input: RegisterInput = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        captchaToken: values.captchaToken,
      };
      await authApi.register(input);
      setRegistrationComplete(true);
      notification.success(REGISTRATION_SUCCESS_MESSAGE, {
        duration: AUTH_SUCCESS_REDIRECT_DELAY_MS,
      });
    } catch (e) {
      notification.error(getGenericErrorMessage(e));
    } finally {
      setSubmitting(false);
      setCaptchaToken(null);
      setValue('captchaToken', '', { shouldValidate: true });
      setCaptchaResetKey((key) => key + 1);
    }
  }

  const SECONDARY_BUTTON_SX = BUTTON_STYLES.secondary;

  return (
    <WelcomeHeading>
      <Box
        component="form"
        noValidate
        aria-busy={submitting}
        onSubmit={handleSubmit(onSubmit)}
        sx={AUTH_FORM_SX}
      >
        <Typography variant="h5" component="div" sx={AUTH_FORM_TITLE_SX}>
          REGISTER
        </Typography>
        <TextField
          label="Email"
          disabled={isFormLocked}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={(isSubmitted || touchedFields.email) && !!errors.email}
          helperText={isSubmitted || touchedFields.email ? (errors.email?.message ?? ' ') : ' '}
        />
        <TextField
          label="First name"
          disabled={isFormLocked}
          autoComplete="given-name"
          {...register('firstName')}
          error={(isSubmitted || touchedFields.firstName) && !!errors.firstName}
          helperText={
            isSubmitted || touchedFields.firstName ? (errors.firstName?.message ?? ' ') : ' '
          }
        />
        <TextField
          label="Last name"
          disabled={isFormLocked}
          autoComplete="family-name"
          {...register('lastName')}
          error={(isSubmitted || touchedFields.lastName) && !!errors.lastName}
          helperText={
            isSubmitted || touchedFields.lastName ? (errors.lastName?.message ?? ' ') : ' '
          }
        />
        <PasswordField
          label="Password"
          disabled={isFormLocked}
          registration={register('password')}
          error={(isSubmitted || touchedFields.password) && !!errors.password}
          helperText={
            (isSubmitted || touchedFields.password) && errors.password?.message
              ? errors.password.message
              : 'Create a password that meets all the requirements below.'
          }
        />
        <PasswordRequirements password={password} />
        <PasswordField
          label="Confirm password"
          disabled={isFormLocked}
          registration={register('confirmPassword')}
          error={
            (isSubmitted || touchedFields.confirmPassword) &&
            (confirmPasswordMismatch || !!errors.confirmPassword)
          }
          helperText={
            isSubmitted || touchedFields.confirmPassword
              ? confirmPasswordMismatch
                ? 'Passwords must match'
                : (errors.confirmPassword?.message ?? ' ')
              : ' '
          }
        />
        <FormControlLabel
          className={isFormLocked ? styles.locked : undefined}
          control={<Checkbox disabled={isFormLocked} {...register('acceptedTerms')} />}
          label={
            <>
              I accept the <Link href="/privacy-policy">terms of use and privacy policy</Link>
            </>
          }
        />
        {(isSubmitted || touchedFields.acceptedTerms) && errors.acceptedTerms?.message ? (
          <Typography color="error" role="alert">
            {errors.acceptedTerms.message}
          </Typography>
        ) : null}
        <input type="hidden" {...register('captchaToken')} />
        <Captcha
          resetKey={captchaResetKey}
          disabled={isFormLocked}
          onTokenChange={(token) => {
            setCaptchaToken(token || null);
            setValue('captchaToken', token, { shouldValidate: true });
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isFormLocked || !isValid || !captchaToken}
          startIcon={submitting ? <CircularProgress size={UI_SIZES.smallIndicator} /> : undefined}
          sx={BUTTON_STYLES.primary}
        >
          Register
        </Button>
        <Box sx={AUTH_FORM_ACTIONS_SX}>
          <Button
            component={Link}
            href="/login"
            disabled={submitting}
            variant="contained"
            sx={SECONDARY_BUTTON_SX}
          >
            Already have an account? Login
          </Button>
          <Button
            component={Link}
            href="/resend-verification"
            disabled={isFormLocked}
            variant="contained"
            sx={SECONDARY_BUTTON_SX}
          >
            Resend verification email
          </Button>
        </Box>
      </Box>
    </WelcomeHeading>
  );
}
