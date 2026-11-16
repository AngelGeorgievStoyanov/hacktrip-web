import { TripList } from '@/components/trips/TripList';
import { HOME_HEADING_STYLE } from '@/styles/presets/typography';
import type { TripGroupResponse } from '@/types';

export function HomeTrips({ trips }: { trips: TripGroupResponse[] }) {
  if (trips.length === 0) return null;

  return (
    <>
      <h3 style={HOME_HEADING_STYLE}>These are our TOP 5 most liked in Hack Trips!</h3>
      <TripList trips={trips} prioritizeFirstImage />
    </>
  );
}
