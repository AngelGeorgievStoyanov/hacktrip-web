import { Typography } from '@mui/material';
import { TripCard } from './TripCard';
import { cardListStyle } from '@/styles/presets/layouts';
import { HEADING_TEXT_SX } from '@/styles/presets/typography';
import styles from './TripList.module.css';
import type { TripGroupResponse } from '@/types';

interface TripListProps {
  trips: TripGroupResponse[];
  prioritizeFirstImage?: boolean;
}

export function TripList({ trips, prioritizeFirstImage = false }: TripListProps) {
  if (trips.length === 0) {
    return (
      <div>
        <Typography component="h5" variant="inherit" className={styles.emptyTitle} sx={HEADING_TEXT_SX}>
          WELCOME!
        </Typography>
        <Typography component="p" variant="inherit" className={styles.emptyText} sx={HEADING_TEXT_SX}>
          No trips found!
        </Typography>
      </div>
    );
  }

  return (
    <ul style={cardListStyle}>
      {trips.map((tripGroup, index) => (
        <li key={tripGroup.id}>
          <TripCard tripGroup={tripGroup} prioritizeImage={prioritizeFirstImage && index === 0} />
        </li>
      ))}
    </ul>
  );
}
