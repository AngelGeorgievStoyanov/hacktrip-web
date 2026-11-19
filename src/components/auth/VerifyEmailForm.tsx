'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CircularProgress, Typography } from '@mui/material';
import { authApi } from '@/api/auth';
import { getTokenErrorMessage } from '@/lib/errors';
import { publishTabEvent } from '@/lib/tabSync';
import { WelcomeHeading } from '@/components/common/WelcomeHeading';
import { useNotification } from '@/components/common/NotificationProvider';
import {
  AUTH_SUCCESS_REDIRECT_DELAY_MS,
  LOGIN_EMAIL_VERIFIED_MESSAGE,
} from '@/constants/notifications';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { EMAIL_VERIFICATION_CARD_SX, EMAIL_VERIFICATION_TITLE_SX } from '@/styles/presets/forms';

export function VerifyEmailForm({ token }: { token?: string }) {
  const router = useRouter();
  const notification = useNotification();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      notification.error('Missing verification token.');
      return;
    }

    let cancelled = false;
    let redirectTimeout: number | undefined;
    setStatus('loading');

    authApi
      .verifyEmail({ token })
      .then(() => {
        if (cancelled) return;

        setStatus('success');
        notification.success(LOGIN_EMAIL_VERIFIED_MESSAGE, {
          duration: AUTH_SUCCESS_REDIRECT_DELAY_MS,
        });
        publishTabEvent({ type: 'email-verified' });

        redirectTimeout = window.setTimeout(
          () => router.replace('/login'),
          AUTH_SUCCESS_REDIRECT_DELAY_MS,
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setStatus('error');
          notification.error(getTokenErrorMessage(error));
        }
      });

    return () => {
      cancelled = true;
      if (redirectTimeout !== undefined) window.clearTimeout(redirectTimeout);
    };
  }, [token, notification, router]);

  return (
    <WelcomeHeading>
      <Card
        sx={EMAIL_VERIFICATION_CARD_SX}
      >
        <Typography variant="h5" component="h1" sx={EMAIL_VERIFICATION_TITLE_SX}>
          Verify email
        </Typography>

        {status === 'loading' ? <CircularProgress /> : null}
        {status === 'success' || status === 'error' ? (
          <>
            <Button
              variant="contained"
              onClick={() => router.replace('/login')}
              sx={BUTTON_STYLES.navigationLink}
            >
              Go to login
            </Button>
          </>
        ) : null}
      </Card>
    </WelcomeHeading>
  );
}
