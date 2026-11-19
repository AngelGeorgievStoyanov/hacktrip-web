import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { NOINDEX } from '@/constants/seo';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { ACCOUNT_PROFILE_PAGE_SX, ACCOUNT_PROFILE_PANEL_SX } from '@/styles/presets/layouts';

export const metadata: Metadata = {
  title: 'Profile',
  robots: NOINDEX,
};

export default function ProfilePage() {
  return (
    <Box
      sx={ACCOUNT_PROFILE_PAGE_SX}
    >
      <Box
        sx={ACCOUNT_PROFILE_PANEL_SX}
      >
        <ProfileForm />
      </Box>
    </Box>
  );
}
