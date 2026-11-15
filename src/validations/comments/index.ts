import { z } from 'zod';
import { COMMENT_LIMIT_MAX } from '@/constants/comments';
import { PAGE_MAX } from '@/constants/pagination';
import { optionalInt, trimmedString } from '../shared';

export const commentBodySchema = z
  .object({
    comment: trimmedString({
      min: 1,
      max: 1000,
      minMessage: 'Comment cannot be empty.',
      maxMessage: 'Maximum comment length is 1000 characters.',
    }),
  })
  .strict();

export const commentPageQuerySchema = z
  .object({
    page: optionalInt({ min: 1, max: PAGE_MAX }),
    limit: optionalInt({ min: 1, max: COMMENT_LIMIT_MAX }),
  })
  .strict();
