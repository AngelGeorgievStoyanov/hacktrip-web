import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ROUTE_CONTENT_PADDING } from '@/constants/ui/spacing';
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
      <main style={{ padding: ROUTE_CONTENT_PADDING, flex: 1 }}>
        <AdminNavigation />
        {children}
      </main>
      <Footer />
    </RequireRole>
  );
}
