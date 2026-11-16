import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ROUTE_CONTENT_PADDING } from '@/constants/ui/spacing';
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
      <main style={{ display: 'flex', justifyContent: 'center', padding: ROUTE_CONTENT_PADDING, flex: 1 }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <GuestOnly>{children}</GuestOnly>
        </div>
      </main>
      <Footer />
    </>
  );
}
