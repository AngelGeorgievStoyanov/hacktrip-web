import { UI_COLORS } from '@/constants/ui/colors';

/** Shared visual role for the previous/next controls used by admin data tables. */
export const ADMIN_PAGINATION_BUTTON_SX = {
  minWidth: 88,
} as const;

/** Shared selected, hover and spacing states for the trip day-number pagination items. */
export const TRIP_DAY_PAGE_ITEM_SX = {
  margin: '3px',
  color: UI_COLORS.text.inverse,
  '&.Mui-selected': {
    backgroundColor: UI_COLORS.action.navigationSelectedBackground,
    color: UI_COLORS.text.inverse,
  },
  '&:hover': {
    backgroundColor: UI_COLORS.action.navigationHoverBackground,
  },
} as const;
