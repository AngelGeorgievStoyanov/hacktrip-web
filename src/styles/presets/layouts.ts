import type { CSSProperties } from 'react';
import { PAGE_CONTENT_PADDING } from '@/constants/ui/spacing';

/** Shared layout presets used where the same page/list layout is required. */
export const pageBackgroundStyle: CSSProperties = {
  boxSizing: 'border-box',
  padding: PAGE_CONTENT_PADDING,
};

export const cardListStyle: CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
};

export const commentListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: '20px',
  alignItems: 'start',
  listStyle: 'none',
  padding: 0,
  margin: 0,
};
