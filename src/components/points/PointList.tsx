'use client';

import { Box, Typography } from '@mui/material';
import { PointCard } from '@/components/points/PointCard';
import type { TripPoint } from '@/types';
import { POINT_LIST_SX } from '@/styles/presets/layouts';
import { POINT_LIST_EMPTY_SX } from '@/styles/presets/typography';

interface PointListProps {
  points: TripPoint[];
  onEdit: (point: TripPoint) => void;
  onDelete: (point: TripPoint) => void;
  onMove: (point: TripPoint, direction: 'up' | 'down') => void;
  disabled?: boolean;
}

export function PointList({ points, onEdit, onDelete, onMove, disabled = false }: PointListProps) {
  const sortedPoints = [...points].sort(
    (first, second) => Number(first.pointNumber) - Number(second.pointNumber),
  );

  if (sortedPoints.length === 0) {
    return <Typography variant="h5" sx={POINT_LIST_EMPTY_SX}>ADD YOUR FIRST POINT</Typography>;
  }

  return (
    <Box sx={POINT_LIST_SX}>
      {sortedPoints.map((point) => (
        <PointCard
          key={point.id}
          point={point}
          length={sortedPoints.length}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}
