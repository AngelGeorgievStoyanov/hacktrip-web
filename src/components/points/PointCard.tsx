'use client';

import { FEATURE_SURFACE_SX } from '@/styles/presets/surfaces';

import { Box, Button, Card, IconButton, Typography } from '@mui/material';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import {
  POINT_CARD_ACTION_BUTTON_SX,
  POINT_CARD_TEXT_INSET_SX,
  POINT_CARD_TEXT_WRAP_SX,
  POINT_CARD_WRAPPER_SX,
  POINT_CARD_CONTAINER_SX,
  getPointCardMoveButtonSx,
  POINT_CARD_ACTION_ROW_SX,
  POINT_CARD_MAP_HEIGHT,
} from '@/styles/presets/cards';
import { GoogleMapView } from '@/components/maps/GoogleMapView';
import { ArrowCircleDownIcon, ArrowCircleUpIcon } from '@/constants/icons';
import type { TripPoint } from '@/types';


interface PointCardProps {
  point: TripPoint;
  length: number;
  onEdit: (point: TripPoint) => void;
  onDelete: (point: TripPoint) => void;
  onMove: (point: TripPoint, direction: 'up' | 'down') => void;
  disabled?: boolean;
}

export function PointCard({
  point,
  length,
  onEdit,
  onDelete,
  onMove,
  disabled = false,
}: PointCardProps) {
  const hasCoordinates = point.lat !== null && point.lng !== null;
  const position = hasCoordinates ? { lat: point.lat as number, lng: point.lng as number } : null;

  return (
    <Box sx={POINT_CARD_WRAPPER_SX}>
      <IconButton
        aria-label={`Move point ${point.pointNumber} up`}
        onClick={() => onMove(point, 'up')}
        disabled={disabled || !point.permissions.canEdit || point.pointNumber <= 1}
        sx={getPointCardMoveButtonSx(point.pointNumber > 1)}
      >
        <ArrowCircleUpIcon />
      </IconButton>

      <Card
        sx={[FEATURE_SURFACE_SX, POINT_CARD_CONTAINER_SX]}
      >
        <Typography gutterBottom component="h6" sx={POINT_CARD_TEXT_INSET_SX}>
          Point N {point.pointNumber}
        </Typography>
        <Typography gutterBottom component="h1" sx={[POINT_CARD_TEXT_INSET_SX, POINT_CARD_TEXT_WRAP_SX]}>
          NAME: {point.name}
        </Typography>
        <Typography gutterBottom component="p" sx={[POINT_CARD_TEXT_INSET_SX, POINT_CARD_TEXT_WRAP_SX]}>
          DESCRIPTION : {point.description ?? ''}
        </Typography>

        {position ? (
          <GoogleMapView
            center={position}
            zoom={14}
            height={POINT_CARD_MAP_HEIGHT}
            markers={[
              {
                id: point.id,
                position,
                title: `Point №${point.pointNumber}`,
                label: String(point.pointNumber),
              },
            ]}
          />
        ) : (
          <Typography gutterBottom component="p">
            NO MAP MARKER ADDED
          </Typography>
        )}

        <Box sx={POINT_CARD_ACTION_ROW_SX}>
          <Button
            variant="contained"
            onClick={() => onEdit(point)}
            disabled={disabled || !point.permissions.canEdit}
            sx={[BUTTON_STYLES.edit, POINT_CARD_ACTION_BUTTON_SX]}
          >
            EDIT POINT
          </Button>
          <Button
            variant="contained"
            onClick={() => onDelete(point)}
            disabled={disabled || !point.permissions.canDelete}
            sx={[BUTTON_STYLES.delete, POINT_CARD_ACTION_BUTTON_SX]}
          >
            DELETE POINT
          </Button>
        </Box>
      </Card>

      <IconButton
        aria-label={`Move point ${point.pointNumber} down`}
        onClick={() => onMove(point, 'down')}
        disabled={disabled || !point.permissions.canEdit || point.pointNumber >= length}
        sx={getPointCardMoveButtonSx(point.pointNumber < length)}
      >
        <ArrowCircleDownIcon />
      </IconButton>
    </Box>
  );
}
