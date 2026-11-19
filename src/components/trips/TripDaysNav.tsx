'use client';

import { useRouter } from 'next/navigation';
import { AppBar, Box, Pagination, PaginationItem } from '@mui/material';
import type { PaginationRenderItemParams } from '@mui/material/Pagination';
import { buildTripUrl } from '@/lib/tripUrl';
import {
  TRIP_DAY_PAGE_ITEM_SX,
  TRIP_DAYS_NAV_APP_BAR_SX,
  TRIP_DAYS_NAV_CONTENT_SX,
  TRIP_DAYS_NAV_PAGINATION_SX,
} from '@/styles/presets/pagination';

interface TripDaysNavProps {
  tripGroupId: number;
  /** The trip group's day numbers, ascending. */
  days: number[];
  selectedDay: number;
  /**
   * Called when the visitor picks another day. When provided, the caller owns the
   * active-day state (client-side switch without a new `GET /trips/:tripGroupId`);
   * otherwise the nav falls back to router navigation which refetches the group.
   */
  onSelect?: (dayNumber: number) => void;
}

/**
 * The parent sticky social/navigation stack owns the shell bleed; this strip fills it.
 */
/**
 * Client Component: the legacy trip page showed a sticky day strip and swapped the visible
 * day without leaving the page. The selected day lives in the URL so the day's points,
 * images and map stay server-rendered.
 */
export function TripDaysNav({ tripGroupId, days, selectedDay, onSelect }: TripDaysNavProps) {
  const router = useRouter();

  if (days.length <= 1) {
    return null;
  }

  const selectedPage = days.indexOf(selectedDay) + 1;

  return (
    <AppBar
      position="static"
      data-trip-days-nav="true"
      sx={TRIP_DAYS_NAV_APP_BAR_SX}
    >
      <Box sx={TRIP_DAYS_NAV_CONTENT_SX}>
        <Pagination
          count={days.length}
          variant="outlined"
          shape="rounded"
          page={selectedPage > 0 ? selectedPage : 1}
          boundaryCount={days.length}
          siblingCount={days.length}
          onChange={(_event, value) => {
            const dayNumber = days[value - 1];
            if (onSelect) {
              onSelect(dayNumber);
              return;
            }
            router.push(buildTripUrl(tripGroupId, dayNumber), { scroll: false });
          }}
          renderItem={(item: PaginationRenderItemParams) =>
            item.type === 'page' ? (
              <PaginationItem {...item} page={days[(item.page ?? 1) - 1]} sx={TRIP_DAY_PAGE_ITEM_SX} />
            ) : (
              <PaginationItem {...item} sx={TRIP_DAY_PAGE_ITEM_SX} />
            )
          }
          sx={TRIP_DAYS_NAV_PAGINATION_SX}
        />
      </Box>
    </AppBar>
  );
}
