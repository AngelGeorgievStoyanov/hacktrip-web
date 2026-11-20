import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { AUTH_LAYOUT_MAIN_SX, AUTH_LAYOUT_CONTENT_SX } from '@/styles/presets/layouts';
import { Box } from '@mui/material';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GuestOnly } from '@/components/auth/GuestOnly';

export const metadata: Metadata = {
  robots: NOINDEX,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box component="main" sx={AUTH_LAYOUT_MAIN_SX}>
        <Box sx={AUTH_LAYOUT_CONTENT_SX}>
          <GuestOnly>{children}</GuestOnly>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
