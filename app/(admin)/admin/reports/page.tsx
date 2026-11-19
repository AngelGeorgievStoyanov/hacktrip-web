import type { Metadata } from 'next';
import { Typography } from '@mui/material';
import { ADMIN_PAGE_TITLE_SX } from '@/styles/presets/typography';
import { NOINDEX } from '@/constants/seo';
import { AdminReports } from '@/components/admin';

export const metadata: Metadata = {
  title: 'Reports',
  robots: NOINDEX,
};

export default function AdminReportsPage() {
  return (
    <section>
      <Typography component="h1" variant="inherit" sx={ADMIN_PAGE_TITLE_SX}>Reports</Typography>
      <AdminReports />
    </section>
  );
}
