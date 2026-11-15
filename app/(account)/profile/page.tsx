import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { NOINDEX } from '@/constants/seo';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { LEGACY_PANEL_SX } from '@/styles/presets/panels';

export const metadata: Metadata = {
  title: 'Profile',
  robots: NOINDEX,
};

export default function ProfilePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          maxWidth: 600,
          height: 'fit-content',
          p: { xs: 2, sm: '30px' },
          ...LEGACY_PANEL_SX,
        }}
      >
        <ProfileForm />
      </Box>
    </Box>
  );
}
