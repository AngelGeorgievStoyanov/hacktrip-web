import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { HomeHero } from '@/components/home';
import { HomeTrips } from '@/components/home/HomeTrips';
import { tripApi } from '@/api/trips';
import type { TripGroupResponse } from '@/types';
import { buildSeoMetadata } from '@/seo';
import { CENTERED_PAGE_MAIN_SX } from '@/styles/presets/layouts';

export const revalidate = 300;

export const metadata: Metadata = buildSeoMetadata({
  title: 'Discover Places, Share Experiences | HackTrip',
  description:
    'Discover destinations, interesting places and real experiences shared by travelers. Explore photos, find inspiration and share your own discoveries with HackTrip.',
  canonicalPath: '/',
});

export default async function HomePage() {
  let topTrips: TripGroupResponse[] = [];
  try {
    topTrips = await tripApi.getTopTrips();
  } catch (error) {
    console.error('[Home] Failed to load top trips for server rendering:', error);
  }

  return (
    <Box component="main" sx={CENTERED_PAGE_MAIN_SX}>
      <HomeHero>
        <HomeTrips trips={topTrips} />
      </HomeHero>
    </Box>
  );
}
