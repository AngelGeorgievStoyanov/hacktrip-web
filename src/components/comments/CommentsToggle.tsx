'use client';

import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';
import { AddCommentIcon, CloseIcon, CommentIcon } from '@/constants/icons';

import { Badge, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { COMMENTS_TOGGLE_ROW_SX, COMMENTS_TOGGLE_EMPTY_LABEL_SX } from '@/styles/presets/comments';
import { SOCIAL_BADGE_COUNT_SX } from '@/styles/presets/social';

interface CommentsToggleProps {
  /** Number of comments for the target, taken from the API response. */
  count: number;
  /** Whether the comment list is currently expanded. */
  open: boolean;
  onToggle: () => void;
  /** Whether the current viewer can create a comment. */
  canCreate: boolean;
  /** Optional note shown above the toggle when there are no comments yet. */
  emptyLabel?: string;
}

/**
 * Show/hide toggle for a comment list.
 *
 * The toggle lives in the trip information card while the list itself is rendered in a
 * separate section, so both can evolve independently (for example with comment sorting).
 */
export function CommentsToggle({ count, open, onToggle, canCreate, emptyLabel }: CommentsToggleProps) {
  return (
    <Box sx={COMMENTS_TOGGLE_ROW_SX}>
      {!open && count === 0 && emptyLabel ? (
        <Typography variant="subtitle1" component="div" sx={COMMENTS_TOGGLE_EMPTY_LABEL_SX}>
          {emptyLabel}
        </Typography>
      ) : null}
      <Tooltip
        title={open ? 'Hide comments' : count > 0 ? `Show ${count} comments` : 'Add comment'}
        arrow
      >
        <IconButton
            sx={ICON_ACTION_STYLES.disclosure}
          onClick={onToggle}
          aria-label={open ? 'Hide comments' : count > 0 ? `Show ${count} comments` : 'Add comment'}
          aria-expanded={open}
          color="primary"
        >
          {open ? (
            <CloseIcon />
          ) : count > 0 ? (
            <Badge badgeContent={count} max={Number.MAX_SAFE_INTEGER} color="primary" sx={SOCIAL_BADGE_COUNT_SX}>
              <CommentIcon />
            </Badge>
          ) : canCreate ? (
            <AddCommentIcon />
          ) : null}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
