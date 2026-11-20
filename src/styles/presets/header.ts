import { BREAKPOINTS, mediaDown } from '@/constants/ui';
import { UI_SIZES } from '@/constants/ui/sizes';
import { BUTTON_STYLES } from '@/styles/presets/buttons';

/** Shared header shell, welcome, menu, drawer and toolbar contracts. */
export const HEADER_ROOT_SX = { flexShrink: 0 } as const;
export const HEADER_WELCOME_SX = { display: 'flex', justifyContent: 'space-between' } as const;
export const HEADER_MENU_ICON_SX = { fontSize: UI_SIZES.iconLarge } as const;
export const HEADER_DRAWER_PAPER_SX = { height: 'auto' } as const;
export const HEADER_DRAWER_NAV_SX = {
  display: 'flex',
  flexDirection: 'column',
  width: 220,
} as const;
export const HEADER_DRAWER_NAV_BUTTON_SX = BUTTON_STYLES.navigation;
export const HEADER_TOOLBAR_SX = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '20px',
  [mediaDown(BREAKPOINTS.headerCompact)]: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
} as const;
