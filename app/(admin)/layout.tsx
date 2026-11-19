import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ROUTE_LAYOUT_MAIN_SX } from '@/styles/presets/layouts';
import { Box } from '@mui/material';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RequireRole } from '@/components/auth';
import { MODERATOR_ROLES } from '@/constants/roles';
import { AdminNavigation } from '@/components/admin/AdminNavigation';

export const metadata: Metadata = {
  robots: NOINDEX,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={[...MODERATOR_ROLES]}>
      <Header />
      <Box component="main" sx={ROUTE_LAYOUT_MAIN_SX}>
        <AdminNavigation />
        {children}
      </Box>
      <Footer />
    </RequireRole>
  );
}
