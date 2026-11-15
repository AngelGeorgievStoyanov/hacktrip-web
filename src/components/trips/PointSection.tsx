'use client';

import { Typography, Card, CardContent, Box } from '@mui/material';
import { ImageGallery } from '@/components/images/ImageGallery';
import { SocialObjectPlaceholder } from '@/components/placeholders';
import { PointActions } from '@/components/points/PointActions';
import { CommentsToggle } from '@/components/comments/CommentsToggle';
import { ExpandableText } from '@/components/common/ExpandableText';
import type { CommentTarget } from '@/api/comments';
import type { TripPoint } from '@/types';
import { CARD_TEXT_INSET_SX } from '@/styles/presets/cards';

interface PointSectionProps {
  point: TripPoint;
  pointCommentTarget: CommentTarget | null;
  togglePointComments: (target: CommentTarget) => void;
}

const POINT_CARD_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '500px',
  margin: '20px auto',
  padding: '25px 0px 0px 0px',
} as const;

export function PointSection({
  point,
  pointCommentTarget,
  togglePointComments,
}: PointSectionProps) {
  if (!point) {
    return null;
  }

  const pointTarget: CommentTarget = { type: 'point', pointId: point.id };
  const isPointOpen =
    pointCommentTarget?.type === 'point' && pointCommentTarget.pointId === point.id;

  return (
    <section aria-label="Trip points">
      <Card sx={POINT_CARD_STYLE}>
        <CardContent sx={{ width: '100%', boxSizing: 'border-box' }}>
          <Typography variant="h5" component="div" sx={[CARD_TEXT_INSET_SX, POINT_NAME_STYLE]}>
            Point name: {point.name}
          </Typography>

          {point.images.length > 0 ? (
            <Box sx={{ width: 'calc(100% + 32px)', mx: '-16px' }}>
              <ImageGallery
                images={point.images}
                alt={point.name}
                preset="tripPointThumb"
                variant="grid"
                activeCommentTarget={pointCommentTarget}
                onToggleComments={togglePointComments}
              />
            </Box>
          ) : (
            <Box sx={{ width: 'calc(100% + 32px)', mx: '-16px', aspectRatio: '1 / 1' }}>
              <SocialObjectPlaceholder />
            </Box>
          )}

          {point.lat === null || point.lng === null ? (
            <Typography variant="body2" sx={POINT_NOTE_STYLE}>
              NO MAP MARKER ADDED
            </Typography>
          ) : null}

          {point.description ? (
            <div style={{ padding: '0px 15px', marginTop: '10px' }}>
              <ExpandableText text={point.description} />
            </div>
          ) : null}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <PointActions point={point} />
            <CommentsToggle
              count={point.social.comments.count}
              open={isPointOpen}
              onToggle={() => togglePointComments(pointTarget)}
            />
          </Box>
        </CardContent>
      </Card>
    </section>
  );
}

const POINT_NAME_STYLE = {
  margin: '0 0 0.35em',
  fontSize: '1.5rem',
  fontWeight: 500,
} as const;

const POINT_NOTE_STYLE = {
  margin: '0 0 0.35em',
  padding: '0px 25px',
  fontSize: '0.875rem',
} as const;
