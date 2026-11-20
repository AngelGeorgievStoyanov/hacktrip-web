import type { Metadata } from 'next';
import { Typography } from '@mui/material';
import { ADMIN_PAGE_TITLE_SX } from '@/styles/presets/typography';
import { NOINDEX } from '@/constants/seo';

export const metadata: Metadata = {
  title: 'Admin',
  robots: NOINDEX,
};

export default function AdminPage() {
  return (
    <section>
      <Typography component="h1" variant="inherit" sx={ADMIN_PAGE_TITLE_SX}>
        Admin
      </Typography>
    </section>
  );
}
