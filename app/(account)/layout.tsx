import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ACCOUNT_LAYOUT_MAIN_SX } from '@/styles/presets/layouts';
import { Box } from '@mui/material';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RequireAuth } from '@/components/auth';

export const metadata: Metadata = {
  robots: NOINDEX,
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Header />
      <Box component="main" sx={ACCOUNT_LAYOUT_MAIN_SX}>{children}</Box>
      <Footer />
    </RequireAuth>
  );
}
