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
  title: 'Travel Inspiration, Places & Trip Ideas',
  description:
    'Find travel inspiration, discover interesting places and explore real experiences shared by travelers. Browse trip ideas, photos and destinations, then create and share your own trips with HackTrip.',
  canonicalPath: '/',
});

export const metadata: Metadata = {
  ...metadata,
  keywords: [
    'HackTrip',
    'Hack Trip',
    'Hack-Trip',
    'travel inspiration',
    'travel ideas',
    'trip ideas',
    'travel experiences',
    'discover places',
    'interesting places to visit',
    'travel destinations',
    'share trips',
    'travel community',
    'trip planning',
    'travel photos',
  ],
};

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
