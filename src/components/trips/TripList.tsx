import { TripCard } from './TripCard';
import { cardListStyle } from '@/styles/presets/layouts';
import { headingTextStyle } from '@/styles/presets/typography';
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
        <h5 className={styles.emptyTitle} style={headingTextStyle}>WELCOME!</h5>
        <p className={styles.emptyText} style={headingTextStyle}>No trips found!</p>
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
