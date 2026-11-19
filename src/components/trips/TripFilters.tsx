'use client';

import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Box, FormControl, InputBase, InputLabel, MenuItem, Select, Toolbar } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import { SELECT_TYPE_KEYS } from '@/constants/config';
import { useSelectChoices } from '@/hooks/useSelects';
import { TRIP_SORT_OPTIONS, type TripSort } from '@/constants/trips';
import { buildTripsUrl, type TripsQueryParams } from '@/lib/tripUrl';
import {
  TRIP_FILTER_LABEL_SX,
  TRIP_FILTER_SEARCH_BOX_SX,
  TRIP_FILTER_SEARCH_BUTTON_SX,
  TRIP_FILTER_SEARCH_ICON_SX,
  TRIP_FILTER_SEARCH_INPUT_SX,
  TRIP_FILTER_SEARCH_SURFACE_SX,
  TRIP_FILTER_SELECT_BOX_SX,
  TRIP_FILTERS_SELECT_GROUP_SX,
  TRIP_FILTER_SELECT_SX,
  TRIP_FILTERS_TOOLBAR_SX,
} from '@/styles/presets/trip-filters';

interface TripFiltersProps {
  search?: string;
  sort?: TripSort;
  group?: string;
  transport?: string;
}

/**
 * Trip list filters. Select changes and submitted searches update the URL immediately;
 * the server-rendered list then follows the new query.
 */
export function TripFilters({ search, sort, group, transport }: TripFiltersProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search ?? '');
  const groupChoices = useSelectChoices(SELECT_TYPE_KEYS.group, group);
  const transportChoices = useSelectChoices(SELECT_TYPE_KEYS.transport, transport);

  const current: TripsQueryParams = { search, group, transport, sort };

  function navigate(patch: Partial<TripsQueryParams>): void {
    router.push(buildTripsUrl({ ...current, page: 1, ...patch }));
  }

  function applySearch(): void {
    navigate({ search: searchInput });
  }

  function handleGroupChange(event: SelectChangeEvent): void {
    navigate({ group: String(event.target.value) });
  }

  function handleTransportChange(event: SelectChangeEvent): void {
    navigate({ transport: String(event.target.value) });
  }

  function handleSortChange(event: SelectChangeEvent): void {
    navigate({ sort: String(event.target.value) as TripSort });
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') applySearch();
  }

  return (
    <AppBar position="sticky">
      <Toolbar sx={TRIP_FILTERS_TOOLBAR_SX}>
        <Box sx={TRIP_FILTERS_SELECT_GROUP_SX}>
          <Box sx={TRIP_FILTER_SELECT_BOX_SX}>
            <FormControl fullWidth>
              <InputLabel id="trips-group-label" sx={TRIP_FILTER_LABEL_SX}>
                TYPE OF GROUP
              </InputLabel>
              <Select
                labelId="trips-group-label"
                label="TYPE OF GROUP"
                value={group ?? ''}
                onChange={handleGroupChange}
                sx={TRIP_FILTER_SELECT_SX}
              >
                <MenuItem value="">ALL</MenuItem>
                {groupChoices.map((choice) => (
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={TRIP_FILTER_SELECT_BOX_SX}>
            <FormControl fullWidth>
              <InputLabel id="trips-transport-label" sx={TRIP_FILTER_LABEL_SX}>
                TYPE OF TRANSPORT
              </InputLabel>
              <Select
                labelId="trips-transport-label"
                label="TYPE OF TRANSPORT"
                value={transport ?? ''}
                onChange={handleTransportChange}
                sx={TRIP_FILTER_SELECT_SX}
              >
                <MenuItem value="">ALL</MenuItem>
                {transportChoices.map((choice) => (
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={TRIP_FILTER_SELECT_BOX_SX}>
            <FormControl fullWidth>
              <InputLabel id="trips-sort-label" sx={TRIP_FILTER_LABEL_SX}>
                SORT
              </InputLabel>
              <Select
                labelId="trips-sort-label"
                label="SORT"
                value={sort ?? TRIP_SORT_OPTIONS.newest}
                onChange={handleSortChange}
                sx={TRIP_FILTER_SELECT_SX}
              >
                <MenuItem value={TRIP_SORT_OPTIONS.newest}>Newest</MenuItem>
                <MenuItem value={TRIP_SORT_OPTIONS.oldest}>Oldest</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={TRIP_FILTER_SEARCH_BOX_SX}>
          <Box sx={TRIP_FILTER_SEARCH_SURFACE_SX}>
            <Box sx={TRIP_FILTER_SEARCH_ICON_SX}>
              <Box
                component="button"
                type="button"
                aria-label="Apply search"
                onClick={applySearch}
                sx={TRIP_FILTER_SEARCH_BUTTON_SX}
              >
                <SearchIcon fontSize="inherit" />
              </Box>
            </Box>
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchInput}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchInput(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              sx={TRIP_FILTER_SEARCH_INPUT_SX}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
