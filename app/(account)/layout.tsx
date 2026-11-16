import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ROUTE_CONTENT_PADDING } from '@/constants/ui/spacing';
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
      <main style={{ padding: ROUTE_CONTENT_PADDING, flex: 1 }}>{children}</main>
      <Footer />
    </RequireAuth>
  );
}
