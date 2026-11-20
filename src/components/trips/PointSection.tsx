'use client';

import { Typography, Card, CardContent, Box } from '@mui/material';
import { ImageGallery } from '@/components/images/ImageGallery';
import { SocialObjectPlaceholder } from '@/components/placeholders';
import { PointActions } from '@/components/points/PointActions';
import { CommentsToggle } from '@/components/comments/CommentsToggle';
import { useAuth } from '@/hooks/useAuth';
import { useSocialConfig } from '@/hooks/useSocialConfig';
import { isSocialActionEnabled, isSocialOperationAllowed } from '@/lib/socialConfig';
import { ExpandableText } from '@/components/common/ExpandableText';
import type { CommentTarget } from '@/api/comments';
import type { TripPoint } from '@/types';
import {
  POINT_SECTION_CARD_SX,
  POINT_SECTION_CONTENT_SX,
  POINT_SECTION_EMPTY_IMAGE_FRAME_SX,
  POINT_SECTION_DESCRIPTION_SX,
  POINT_SECTION_ACTION_ROW_SX,
  POINT_SECTION_NOTE_SX,
  POINT_SECTION_TITLE_SX,
} from '@/styles/presets/trip-details';
import { POINT_SECTION_IMAGE_FRAME_SX } from '@/styles/presets/image-gallery';

interface PointSectionProps {
  point: TripPoint;
  pointCommentTarget: CommentTarget | null;
  togglePointComments: (target: CommentTarget) => void;
}

export function PointSection({
  point,
  pointCommentTarget,
  togglePointComments,
}: PointSectionProps) {
  const { status } = useAuth();
  const socialConfig = useSocialConfig();
  if (!point) {
    return null;
  }

  const commentsEnabled = isSocialActionEnabled(socialConfig.data, 'comment', 'point');
  const canCreateComment = isSocialOperationAllowed(
    socialConfig.data,
    'comment',
    'point',
    'create',
  );
  const canShowComments =
    commentsEnabled &&
    (point.social.comments.count > 0 || (status === 'authenticated' && canCreateComment));

  const pointTarget: CommentTarget = { type: 'point', pointId: point.id };
  const isPointOpen =
    pointCommentTarget?.type === 'point' && pointCommentTarget.pointId === point.id;

  return (
    <section aria-label="Trip points">
      <Card sx={POINT_SECTION_CARD_SX}>
        <CardContent sx={POINT_SECTION_CONTENT_SX}>
          <Typography variant="h5" component="div" sx={POINT_SECTION_TITLE_SX}>
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
            <Box sx={POINT_SECTION_EMPTY_IMAGE_FRAME_SX}>
              <SocialObjectPlaceholder />
            </Box>
          )}

          {point.lat === null || point.lng === null ? (
            <Typography variant="body2" sx={POINT_SECTION_NOTE_SX}>
              NO MAP MARKER ADDED
            </Typography>
          ) : null}

          {point.description ? (
            <Box sx={POINT_SECTION_DESCRIPTION_SX}>
              <ExpandableText text={point.description} />
            </Box>
          ) : null}

          <Box sx={POINT_SECTION_ACTION_ROW_SX}>
            <PointActions point={point} />
            {canShowComments ? (
              <CommentsToggle
                count={point.social.comments.count}
                open={isPointOpen}
                onToggle={() => togglePointComments(pointTarget)}
                canCreate={status === 'authenticated' && canCreateComment}
              />
            ) : null}
          </Box>
        </CardContent>
      </Card>
    </section>
  );
}
