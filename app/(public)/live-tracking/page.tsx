import type { Metadata } from 'next';
import { NOINDEX } from '@/constants/seo';
import { Box } from '@mui/material';
import { LIVE_TRACKING_PAGE_MAIN_SX } from '@/styles/presets/tracking';
import { LiveTracker } from '@/components/tracking';
import { RequireModeratorRedirect } from '@/components/auth/RequireModeratorRedirect';

export const metadata: Metadata = {
  title: 'Live trip tracking',
  robots: NOINDEX,
};

export default function LiveTrackingPage() {
  return (
    <RequireModeratorRedirect>
      <Box component="main" sx={LIVE_TRACKING_PAGE_MAIN_SX}>
        <section>
          <h1>Live trip tracking</h1>
          <p>Record your position while you travel and watch the route build on the map.</p>
          <LiveTracker />
        </section>
      </Box>
    </RequireModeratorRedirect>
  );
}
