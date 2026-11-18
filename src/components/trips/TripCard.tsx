'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  MobileStepper,
  Pagination,
  PaginationItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { PaginationRenderItemParams } from '@mui/material/Pagination';
import { AppImage } from '@/components/images';
import { SocialObjectPlaceholder } from '@/components/placeholders';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  BREAKPOINTS,
  maxWidthQuery,
} from '@/constants/ui';
import { LIGHTBOX_SWIPE_THRESHOLD_PX } from '@/constants/images';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import {
  TRIP_CARD_SX, CARD_TEXT_INSET_SX, TRIP_TRIP_CARD_HEIGHT, TRIP_CARD_HEADER_SX,
  getTripCardEmptyHeaderSx, TRIP_CARD_TRIP_CARD_IMAGE_FRAME_SX, TRIP_CARD_TRIP_CARD_SOCIAL_COUNTS_SX,
  TRIP_CARD_TRIP_CARD_STEPPER_SPACE_SX, TRIP_TRIP_CARD_CONTENT_SX, TRIP_CARD_SOCIAL_ROW_SX,
  TRIP_CARD_TRIP_CARD_PAGINATION_SX, TRIP_CARD_TRIP_CARD_DESCRIPTION_SX, TRIP_CARD_STEPPER_SX,
} from '@/styles/presets/cards';
import { buildTripUrl } from '@/lib/tripUrl';
import type { TripGroupResponse } from '@/types';

interface TripCardProps {
  tripGroup: TripGroupResponse;
  prioritizeImage?: boolean;
}

/**
 * One shared card serves the home, trips, my trips and favorites lists.
 * The group response already carries every day, so changing days/images stays local
 * and does not issue additional API requests.
 */
export function TripCard({ tripGroup, prioritizeImage = false }: TripCardProps) {
  const days = tripGroup.days;
  const [dayNumber, setDayNumber] = useState(days[0]?.dayNumber ?? 1);
  const [activeStep, setActiveStep] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isMobile = useMediaQuery(maxWidthQuery(BREAKPOINTS.tripCard));
  const theme = useTheme();

  const selectedDay = days.find((day) => day.dayNumber === dayNumber);
  const selectedPage = days.findIndex((day) => day.dayNumber === dayNumber) + 1;
  const images = selectedDay?.images ?? [];
  const maxSteps = images.length;

  // Group likes stay unchanged when the selected day changes.
  const groupLikes = tripGroup.social.likes;
  const dayLikes = selectedDay?.social.likes ?? 0;

  const detailsHref = selectedDay
    ? buildTripUrl(tripGroup.id, selectedDay.dayNumber)
    : buildTripUrl(tripGroup.id);

  const title = selectedDay?.title ?? 'Trip';
  const description = selectedDay?.description ?? null;

  function handleDayChange(_event: ChangeEvent<unknown>, value: number): void {
    setDayNumber(days[value - 1]?.dayNumber ?? value);
    setActiveStep(0);
  }

  function handleNext(): void {
    setActiveStep((step) => Math.min(step + 1, maxSteps - 1));
  }

  function handleBack(): void {
    setActiveStep((step) => Math.max(step - 1, 0));
  }

  function handleTouchEnd(): void {
    const start = touchStartX.current;
    const end = touchEndX.current;
    touchStartX.current = null;
    touchEndX.current = null;
    if (start === null || end === null) {
      return;
    }
    const distance = start - end;
    if (distance > LIGHTBOX_SWIPE_THRESHOLD_PX) {
      handleNext();
    } else if (distance < -LIGHTBOX_SWIPE_THRESHOLD_PX) {
      handleBack();
    }
  }

  function renderPaginationItem(item: PaginationRenderItemParams) {
    return item.type === 'page' ? (
      <PaginationItem {...item} page={days[(item.page ?? 1) - 1]?.dayNumber ?? item.page} />
    ) : (
      <PaginationItem {...item} />
    );
  }

  // Keep the legacy empty-day state for pagination gaps.
  if (!selectedDay) {
    return (
      <Card sx={[TRIP_CARD_SX, { height: isMobile ? 'fit-content' : 'auto', maxHeight: '500px' }]}>
        <Box sx={getTripCardEmptyHeaderSx(isMobile)}>
          <Typography gutterBottom variant="h5" sx={CARD_TEXT_INSET_SX}>
            No trip on {dayNumber} day
          </Typography>
        </Box>
        <CardContent sx={TRIP_CARD_CONTENT_SX}>
          {days.length > 1 ? (
            <Pagination
              count={days.length}
              variant="outlined"
              shape="rounded"
              page={Math.max(selectedPage, 1)}
              onChange={handleDayChange}
              renderItem={renderPaginationItem}
              sx={TRIP_CARD_PAGINATION_SX}
            />
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={[
        TRIP_CARD_SX,
        {
          width: '352px',
          maxWidth: 'calc(100vw - 40px)',
          height: TRIP_CARD_HEIGHT,
          minHeight: TRIP_CARD_HEIGHT,
          maxHeight: TRIP_CARD_HEIGHT,
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      ]}
    >
      <Box sx={TRIP_CARD_HEADER_SX}>
        <Typography gutterBottom variant="h5" sx={[CARD_TEXT_INSET_SX, { textAlign: 'center' }]}>
          Title: {title}
        </Typography>
        {description ? (
          <Typography variant="body2" sx={[TRIP_CARD_DESCRIPTION_SX, CARD_TEXT_INSET_SX]}>
            Description: {description}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={TRIP_CARD_IMAGE_FRAME_SX}
        onTouchStart={(event) => {
          touchEndX.current = null;
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchMove={(event) => {
          touchEndX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <AppImage
            image={images[activeStep]}
            preset="tripCard"
            useThumbnail
            loading={prioritizeImage ? 'eager' : undefined}
            fetchPriority={prioritizeImage ? 'high' : undefined}
            alt={title}
            fill
          />
        ) : (
          <SocialObjectPlaceholder key={dayNumber} />
        )}
      </Box>

      {images.length > 0 ? (
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={TRIP_CARD_STEPPER_SX}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </Button>
          }
        />
      ) : (
        <Box sx={TRIP_CARD_STEPPER_SPACE_SX} />
      )}

      <Box aria-label="Trip and day likes" sx={TRIP_CARD_SOCIAL_COUNTS_SX}>
        <Box sx={TRIP_CARD_SOCIAL_ROW_SX}>
          <Typography component="span" variant="body2">
            Trip:
          </Typography>
          <FavoriteIcon fontSize="small" color="error" />
          {groupLikes > 0 ? (
            <Typography component="span" variant="body2">
              {groupLikes}
            </Typography>
          ) : null}
        </Box>
        <Box sx={TRIP_CARD_SOCIAL_ROW_SX}>
          <Typography component="span" variant="body2">
            Day:
          </Typography>
          <FavoriteIcon fontSize="small" color="error" />
          {dayLikes > 0 ? (
            <Typography component="span" variant="body2">
              {dayLikes}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <CardContent sx={TRIP_CARD_CONTENT_SX}>
        <Button
          component={Link}
          href={detailsHref}
          variant="contained"
          sx={BUTTON_STYLES.primaryWide}
        >
          DETAILS
        </Button>

        {days.length > 1 ? (
          <Pagination
            count={days.length}
            variant="outlined"
            shape="rounded"
            page={selectedPage}
            onChange={handleDayChange}
            renderItem={renderPaginationItem}
            sx={TRIP_CARD_PAGINATION_SX}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
