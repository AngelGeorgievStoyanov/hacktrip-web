'use client';

import { Typography, Card, CardContent, Box } from '@mui/material';
import { ImageGallery } from '@/components/images/ImageGallery';
import { SocialObjectPlaceholder } from '@/components/placeholders';
import { PointActions } from '@/components/points/PointActions';
import { CommentsToggle } from '@/components/comments/CommentsToggle';
import { ExpandableText } from '@/components/common/ExpandableText';
import type { CommentTarget } from '@/api/comments';
import type { TripPoint } from '@/types';
import {
  CARD_CONTENT_TOP_PADDING,
  CARD_HEADING_TEXT_STYLE,
  CARD_TEXT_BLOCK_STYLE,
  CARD_TEXT_INSET_SX,
} from '@/styles/presets/cards';
import { POINT_SECTION_IMAGE_FRAME_SX } from '@/styles/presets/image-gallery';

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
  ...CARD_CONTENT_TOP_PADDING,
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
            <Box sx={POINT_SECTION_IMAGE_FRAME_SX}>
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
            <Box sx={{ ...POINT_SECTION_IMAGE_FRAME_SX, aspectRatio: '1 / 1' }}>
              <SocialObjectPlaceholder />
            </Box>
          )}

          {point.lat === null || point.lng === null ? (
            <Typography variant="body2" sx={POINT_NOTE_STYLE}>
              NO MAP MARKER ADDED
            </Typography>
          ) : null}

          {point.description ? (
            <div style={{ ...CARD_TEXT_INSET_SX, marginTop: '10px' }}>
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

const POINT_NAME_STYLE = CARD_HEADING_TEXT_STYLE;

const POINT_NOTE_STYLE = {
  ...CARD_TEXT_BLOCK_STYLE,
  padding: '0px 25px',
} as const;
