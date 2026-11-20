import { Typography } from '@mui/material';
import { TripList } from '@/components/trips/TripList';
import { HOME_HEADING_SX } from '@/styles/presets/typography';
import type { TripGroupResponse } from '@/types';

export function HomeTrips({ trips }: { trips: TripGroupResponse[] }) {
  if (trips.length === 0) return null;

  return (
    <>
      <Typography component="h3" variant="inherit" sx={HOME_HEADING_SX}>
        These are our TOP 5 most liked in Hack Trips!
      </Typography>
      <TripList trips={trips} prioritizeFirstImage />
    </>
  );
}
