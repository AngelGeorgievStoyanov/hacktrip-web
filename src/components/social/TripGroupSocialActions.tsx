'use client';

import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';

import { useState } from 'react';
import { Badge, Box, IconButton, Tooltip } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import ReportIcon from '@mui/icons-material/Report';
import ReportOffIcon from '@mui/icons-material/ReportOff';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { absoluteUrl } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { useTripGroupSocial } from '@/hooks/useTripGroup';
import { useSocialConfig } from '@/hooks/useSocialConfig';
import { getGenericErrorMessage } from '@/lib/errors';
import { SOCIAL_ERROR_TEXT_SX, TRIP_GROUP_SOCIAL_ACTIONS_SX, getSocialLikeAnimationSx } from '@/styles/presets/social';
import { isSocialActionEnabled, isSocialOperationAllowed } from '@/lib/socialConfig';
import { shareWithFallback } from '@/lib/share';
import { SocialConfigStatus } from './SocialConfigStatus';
import { useLikeAnimation } from '@/components/social/LikeAnimation';
import { CommentsToggle } from '@/components/comments/CommentsToggle';
import type { SocialState } from '@/types';

interface TripGroupSocialActionsProps {
  tripGroupId: number;
  social: SocialState;
  shareTitle?: string;
  shareText?: string;
  shareDayNumber?: number;
  /** Whether the Trip Group comment section is open (controlled by TripDetailsView). */
  open?: boolean;
  /** Toggles the Trip Group comment section. */
  onToggle?: () => void;
}

const BADGE_MAX = Number.MAX_SAFE_INTEGER;

export function TripGroupSocialActions({
  tripGroupId,
  social,
  shareTitle,
  shareText,
  shareDayNumber,
  open,
  onToggle,
}: TripGroupSocialActionsProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const [internalTripGroupCommentsOpen, setInternalTripGroupCommentsOpen] = useState(false);
  const { likeMutation, favoriteMutation, reportActions } = useTripGroupSocial(tripGroupId, social);
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';
  const socialConfig = useSocialConfig();

  const liked = social.likedByMe;
  const likes = social.likes;
  const favorited = social.favoritedByMe ?? false;
  const reported = social.reportedByMe;
  const likeAnimation = useLikeAnimation(liked, { failed: likeMutation.isError });

  const canLike = isSocialOperationAllowed(
    socialConfig.data,
    'like',
    'tripGroup',
    liked ? 'delete' : 'create',
  );
  const canFavorite = isSocialOperationAllowed(
    socialConfig.data,
    'favorite',
    'tripGroup',
    favorited ? 'delete' : 'create',
  );
  const canReport = isSocialOperationAllowed(
    socialConfig.data,
    'report',
    'tripGroup',
    reported ? 'delete' : 'create',
  );
  const commentsEnabled = isSocialActionEnabled(socialConfig.data, 'comment', 'tripGroup');
  const canCreateComment = isSocialOperationAllowed(socialConfig.data, 'comment', 'tripGroup', 'create');

  const isTripGroupCommentsOpen = open !== undefined ? open : internalTripGroupCommentsOpen;

  const handleToggleTripGroupComments = (): void => {
    if (onToggle) {
      onToggle();
      return;
    }
    setInternalTripGroupCommentsOpen((previous) => !previous);
  };

  async function handleShare(): Promise<void> {
    const title = shareTitle ?? 'Trip';
    const dayQuery = shareDayNumber === undefined ? '' : `?day=${shareDayNumber}`;
    const result = await shareWithFallback({
      url: absoluteUrl(`/trips/${tripGroupId}${dayQuery}`),
      title,
      text: shareText ?? title,
    });
    if (result === 'copied') {
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    }
  }

  return (
    <Box sx={TRIP_GROUP_SOCIAL_ACTIONS_SX}>
      <SocialConfigStatus isLoading={socialConfig.isLoading} error={socialConfig.error} />
      {isAuthenticated && canLike ? (
        <Tooltip title={liked ? 'Unlike trip group' : 'Like trip group'} arrow>
          <span>
            <IconButton
              sx={ICON_ACTION_STYLES.like}
              onClick={() => {
                likeAnimation.requestPlay();
                likeMutation.mutate();
              }}
              disabled={likeMutation.isPending}
              aria-label={
                liked ? `Unlike trip group (${likes} likes)` : `Like trip group (${likes} likes)`
              }
              aria-pressed={liked}
              color={liked ? 'primary' : 'default'}
            >
              <Badge badgeContent={likes} invisible={likes === 0} max={BADGE_MAX} color="primary">
                {liked ? (
                  <ThumbUpIcon sx={getSocialLikeAnimationSx(likeAnimation.animation)} />
                ) : (
                  <ThumbUpOffAltIcon sx={getSocialLikeAnimationSx(likeAnimation.animation)} />
                )}
              </Badge>
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {isAuthenticated && canFavorite ? (
        <Tooltip
          title={favorited ? 'Remove trip group from favorites' : 'Add trip group to favorites'}
          arrow
        >
          <span>
            <IconButton
              sx={ICON_ACTION_STYLES.favorite}
              onClick={() => favoriteMutation.mutate()}
              disabled={favoriteMutation.isPending}
              aria-label={
                favorited ? 'Remove trip group from favorites' : 'Add trip group to favorites'
              }
              aria-pressed={favorited}
              color="primary"
            >
              <Badge
                badgeContent={social.favorites ?? 0}
                invisible={(social.favorites ?? 0) === 0}
                max={BADGE_MAX}
                color="primary"
              >
                {favorited ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
              </Badge>
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {isAuthenticated && canReport ? (
        <Tooltip title={reported ? 'Withdraw trip group report' : 'Report trip group'} arrow>
          <span>
            <IconButton
              sx={ICON_ACTION_STYLES.report}
              onClick={() => {
                if (reported) {
                  reportActions.unreport();
                } else {
                  reportActions.clearError();
                  reportActions.report();
                }
              }}
              disabled={reportActions.pending}
              aria-label={reported ? 'Withdraw trip group report' : 'Report trip group'}
              aria-pressed={reported}
              color={reported ? 'error' : 'default'}
            >
              {reported ? <ReportOffIcon /> : <ReportIcon />}
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {commentsEnabled && (social.comments.count > 0 || (isAuthenticated && canCreateComment)) ? (
        <CommentsToggle
          count={social.comments.count}
          open={isTripGroupCommentsOpen}
          onToggle={handleToggleTripGroupComments}
          canCreate={isAuthenticated && canCreateComment}
        />
      ) : null}
      <Tooltip title={shareCopied ? 'Link copied' : 'Share trip group'} arrow>
        <IconButton
          sx={ICON_ACTION_STYLES.share}
          onClick={() => void handleShare()}
          aria-label={shareCopied ? 'Link copied' : 'Share trip group'}
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>
      {isAuthenticated && likeMutation.error ? (
        <Box component="span" role="alert" sx={SOCIAL_ERROR_TEXT_SX}>
          {getGenericErrorMessage(likeMutation.error)}
        </Box>
      ) : null}
      {isAuthenticated && favoriteMutation.error ? (
        <Box component="span" role="alert" sx={SOCIAL_ERROR_TEXT_SX}>
          {getGenericErrorMessage(favoriteMutation.error)}
        </Box>
      ) : null}
      {isAuthenticated && reportActions.error ? (
        <Box component="span" role="alert" sx={SOCIAL_ERROR_TEXT_SX}>
          {reportActions.error}
        </Box>
      ) : null}
    </Box>
  );
}
