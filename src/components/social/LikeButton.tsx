'use client';

import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, IconButton, Tooltip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { socialApi } from '@/api/social';
import { getGenericErrorMessage } from '@/lib/errors';
import { useLikeAnimation } from '@/components/social/LikeAnimation';
import { invalidateSocialQueries } from '@/lib/socialQuerySync';
import type { SocialTargetTypeInput } from '@/types';
import { useNotification } from '@/components/common/NotificationProvider';
import { getSocialBadgeSx, getSocialLikeAnimationSx } from '@/styles/presets/social';

interface LikeButtonProps {
  targetType: SocialTargetTypeInput;
  targetId: number;
  /**
   * Current-user like state for the target, taken from the API response
   * (`social.likedByMe`). It is the source of truth for the rendered state.
   */
  initialLiked: boolean;
  /** Total number of likes, taken from the API response (`social.likes`). */
  initialLikes: number;
  /** Icon button size. `'medium'` elsewhere, `'small'` for image overlays. */
  size?: 'small' | 'medium';
}

export function LikeButton({
  targetType,
  targetId,
  initialLiked,
  initialLikes,
  size = 'medium',
}: LikeButtonProps) {
  const notification = useNotification();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const queryClient = useQueryClient();

  // A fresh API response (for example the authenticated read after a reload) restores the
  // state without requiring another click.
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (liked) {
        await socialApi.unlike({ targetType, targetId });
        return null;
      }
      return socialApi.like({ targetType, targetId });
    },
    onSuccess: (state) => {
      invalidateSocialQueries(queryClient, targetType);
      // The backend answers a like with the resulting social state; an unlike has no
      // body, so the removed like is applied locally.
      if (state) {
        setLiked(state.likedByMe);
        setLikes(state.likes);
        return;
      }
      setLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
    },
    onError: (e) => notification.error(getGenericErrorMessage(e)),
  });

  const likeAnimation = useLikeAnimation(liked, { failed: mutation.isError });

  return (
    <>
      <Tooltip title={liked ? 'Unlike' : 'Like'} arrow>
        <span>
          <IconButton
            sx={ICON_ACTION_STYLES.like}
            onClick={() => {
              likeAnimation.requestPlay();
              mutation.mutate();
            }}
            disabled={mutation.isPending}
            aria-label={liked ? `Unlike (${likes} likes)` : `Like (${likes} likes)`}
            aria-pressed={liked}
            color={liked ? 'primary' : 'default'}
            size={size}
          >
            <Badge
              badgeContent={likes}
              invisible={likes === 0}
              max={Number.MAX_SAFE_INTEGER}
              color="primary"
              sx={
                getSocialBadgeSx(size)
              }
            >
              {liked ? (
                <ThumbUpIcon sx={getSocialLikeAnimationSx(likeAnimation.animation)} />
              ) : (
                <ThumbUpOffAltIcon sx={getSocialLikeAnimationSx(likeAnimation.animation)} />
              )}
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
