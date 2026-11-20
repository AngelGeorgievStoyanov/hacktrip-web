"use client";

import { Box } from '@mui/material';
import { ProfileForm } from '@/components/auth/ProfileForm';
import {
  ACCOUNT_PROFILE_PAGE_SX,
  ACCOUNT_PROFILE_PANEL_SX,
} from '@/styles/presets/layouts';

/**
 * Client boundary for the profile page's theme-aware MUI sx preset.
 * The sx callback must stay inside the client module and must not be
 * serialized from the Server Component route.
 */
export function ProfilePageContent() {
  return (
    <Box sx={ACCOUNT_PROFILE_PAGE_SX}>
      <Box sx={ACCOUNT_PROFILE_PANEL_SX}>
        <ProfileForm />
      </Box>
    </Box>
  );
}
