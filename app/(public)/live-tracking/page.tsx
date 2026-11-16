import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { ROUTE_CONTENT_PADDING } from '@/constants/ui/spacing';
import { LiveTracker } from '@/components/tracking';
import { RequireModeratorRedirect } from '@/components/auth/RequireModeratorRedirect';

export const metadata: Metadata = {
  title: 'Live trip tracking',
  robots: NOINDEX,
};

export default function LiveTrackingPage() {
  return (
    <RequireModeratorRedirect>
      <main style={{ padding: ROUTE_CONTENT_PADDING }}>
        <section>
          <h1>Live trip tracking</h1>
          <p>Record your position while you travel and watch the route build on the map.</p>
          <LiveTracker />
        </section>
      </main>
    </RequireModeratorRedirect>
  );
}
