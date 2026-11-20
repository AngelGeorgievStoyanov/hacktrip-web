import { Box, Typography } from '@mui/material';
import { TripCard } from './TripCard';
import { CARD_LIST_SX } from '@/styles/presets/layouts';
import { TRIP_LIST_EMPTY_TEXT_SX, TRIP_LIST_EMPTY_TITLE_SX } from '@/styles/presets/typography';
import type { TripGroupResponse } from '@/types';

interface TripListProps {
  trips: TripGroupResponse[];
  prioritizeFirstImage?: boolean;
}

export function TripList({ trips, prioritizeFirstImage = false }: TripListProps) {
  if (trips.length === 0) {
    return (
      <div>
        <Typography component="h5" variant="inherit" sx={TRIP_LIST_EMPTY_TITLE_SX}>
          WELCOME!
        </Typography>
        <Typography component="p" variant="inherit" sx={TRIP_LIST_EMPTY_TEXT_SX}>
          No trips found!
        </Typography>
      </div>
    );
  }

  return (
    <Box component="ul" sx={CARD_LIST_SX}>
      {trips.map((tripGroup, index) => (
        <li key={tripGroup.id}>
          <TripCard tripGroup={tripGroup} prioritizeImage={prioritizeFirstImage && index === 0} />
        </li>
      ))}
    </Box>
  );
}
