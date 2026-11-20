'use client';

import { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { TripActions } from './TripActions';
import { ExpandMoreIcon, InfoIcon } from '@/constants/icons';
import { EngagementBar } from '@/components/social/EngagementBar';
import { FavoriteButton } from '@/components/social/FavoriteButton';
import { BackButton } from '@/components/common/BackButton';
import Link from 'next/link';
import type { CommentTarget } from '@/api/comments';
import { useAuth } from '@/hooks/useAuth';
import { useSocialConfig } from '@/hooks/useSocialConfig';
import { isSocialOperationAllowed, socialConfigTargetKey } from '@/lib/socialConfig';
import type { TripGroupDay, TripGroupResponse } from '@/types';
import {
  TRIP_DETAILS_CARD_SX,
  TRIP_DETAILS_HEADER_SX,
  TRIP_DETAILS_TITLE_SX,
  TRIP_DETAILS_PRICE_ROW_SX,
  TRIP_DETAILS_PRICE_LABEL_SX,
  TRIP_DETAILS_PRICE_VALUE_SX,
  TRIP_DETAILS_METADATA_SX,
  TRIP_DETAILS_DESCRIPTION_SX,
  getTripDetailsDescriptionToggleSx,
  TRIP_DETAILS_ACTIONS_COLUMN_SX,
  TRIP_DETAILS_SOCIAL_ROW_SX,
} from '@/styles/presets/trip-details';
import { TRIP_ACTION_BUTTON_LAYOUT_SX, ICON_ACTION_STYLES } from '@/styles/presets/buttons';

interface TripDetailsProps {
  tripGroup: TripGroupResponse;
  /** The day currently selected by the day strip. */
  day: TripGroupDay;
  /** The currently open comments target for the Trip section (day / day image), or null when closed. */
  tripCommentTarget: CommentTarget | null;
  /** Toggles the comments panel for a given target within the Trip section. */
  toggleTripComments: (target: CommentTarget) => void;
  onDayDeleted: (updatedTripGroup: TripGroupResponse) => void;
}

/**
 * Trip Information Panel — standalone visual section matching legacy UI.
 * Contains trip metadata, social actions, trip actions, description.
 * Does NOT include map, point, or day image gallery.
 * Trip Group actions use `tripGroup.social`; Like/Favorite/Report for the selected day
 * use that day's `social` state. Comments remain day-level.
 */
export function TripDetails({
  tripGroup,
  day,
  tripCommentTarget,
  toggleTripComments,
  onDayDeleted,
}: TripDetailsProps) {
  const totalPoints = tripGroup.days.reduce((sum, current) => sum + current.points.length, 0);
  const [expanded, setExpanded] = useState(false);

  const { status } = useAuth();
  const socialConfig = useSocialConfig();
  const isAuthenticated = status === 'authenticated';
  const canFavorite = isSocialOperationAllowed(
    socialConfig.data,
    'favorite',
    socialConfigTargetKey('trip'),
    day.social.favoritedByMe ? 'delete' : 'create',
  );

  const dayTarget: CommentTarget = { type: 'day', tripGroupId: tripGroup.id, tripId: day.id };
  const isDayOpen =
    tripCommentTarget?.type === 'day' &&
    tripCommentTarget.tripGroupId === dayTarget.tripGroupId &&
    tripCommentTarget.tripId === dayTarget.tripId;

  const transportName = day.transport.name.trim();
  const groupName = day.group.name.trim();
  const destination = day.destination?.trim();

  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card sx={TRIP_DETAILS_CARD_SX}>
      <Box sx={TRIP_DETAILS_HEADER_SX}>
        <Typography variant="h5" component="div" sx={TRIP_DETAILS_TITLE_SX}>
          TRIP NAME : {day.title ?? tripGroup.days[0]?.title ?? 'Trip'}
        </Typography>
        {isAuthenticated && canFavorite ? (
          <FavoriteButton
            targetType="trip"
            targetId={day.id}
            initialFavorited={day.social.favoritedByMe ?? false}
            initialFavorites={day.social.favorites ?? 0}
          />
        ) : null}
      </Box>

      {day.price != null ? (
        <Box sx={TRIP_DETAILS_PRICE_ROW_SX}>
          <Typography variant="subtitle1" component="h5" sx={TRIP_DETAILS_PRICE_LABEL_SX}>
            PRICE OF THE TRIP:
          </Typography>
          <Typography variant="subtitle1" component="h5" sx={TRIP_DETAILS_PRICE_VALUE_SX}>
            {day.price}
            {day.currency?.code ? ` ${day.currency.code}` : ''}
          </Typography>
          {day.currency?.name ? (
            <Tooltip title={day.currency.name} arrow>
              <IconButton size="small" aria-label="Currency info" sx={ICON_ACTION_STYLES.base}>
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      ) : null}

      {transportName ? (
        <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_METADATA_SX}>
          TRANSPORT WITH: {transportName}
        </Typography>
      ) : null}
      <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_METADATA_SX}>
        COUNT OF PEOPLE: {day.countPeoples}
      </Typography>
      {groupName ? (
        <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_METADATA_SX}>
          TYPE OF THE GROUP: {groupName}
        </Typography>
      ) : null}
      {destination ? (
        <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_METADATA_SX}>
          DESTINATION: {destination}
        </Typography>
      ) : null}

      {day.description ? (
        <>
          {day.description.length < 150 ? (
            <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_DESCRIPTION_SX}>
              Description: {day.description}
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_DESCRIPTION_SX}>
                Description: {day.description.slice(0, 150)}...
              </Typography>
              <CardActions disableSpacing>
                <IconButton
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label={expanded ? 'Show less' : 'Show more'}
                  sx={[ICON_ACTION_STYLES.base, getTripDetailsDescriptionToggleSx(expanded)]}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>{day.description}</Typography>
                </CardContent>
              </Collapse>
            </>
          )}
        </>
      ) : null}

      <Typography variant="subtitle1" component="div" sx={TRIP_DETAILS_METADATA_SX}>
        {totalPoints > 0
          ? `FOR THIS TRIP HAVE ${totalPoints} POINTS`
          : 'FOR THIS TRIP DONT HAVE POINTS'}
      </Typography>

      <Box sx={TRIP_DETAILS_ACTIONS_COLUMN_SX}>
        <TripActions tripGroup={tripGroup} tripId={day.id} section="navigation" />
        <TripActions
          tripGroup={tripGroup}
          tripId={day.id}
          section="management"
          onDayDeleted={onDayDeleted}
        />
        <BackButton component={Link} href="/trips" sx={TRIP_ACTION_BUTTON_LAYOUT_SX}>
          BACK
        </BackButton>
      </Box>

      <Box sx={TRIP_DETAILS_SOCIAL_ROW_SX}>
        <EngagementBar
          targetType="trip"
          targetId={day.id}
          social={day.social}
          commentTarget={dayTarget}
          showComments
          commentsOpen={isDayOpen}
          onToggleComments={() => toggleTripComments(dayTarget)}
          showFavorite={false}
          actionsJustify="space-around"
        />
      </Box>
    </Card>
  );
}
