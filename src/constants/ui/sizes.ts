/**
 * Shared dimensions reused across multiple components.
 * Component-specific geometry stays local until repeated usage is established by the audit.
 */
export const UI_SIZES = {
  smallIndicator: 18,
  iconLarge: 32,
  compactControlHeight: 36,
  contentMaxWidth: 1440,
  cardTextInset: 15,
  pointCardTextInset: 10,
  wideButtonPaddingY: 10,
  wideButtonPaddingX: 50,
  footerHorizontalPadding: 20,
  paginationItemMinSize: 32,
  paginationItemPaddingY: 6,
  paginationItemPaddingX: 10,
  focusOutlineWidth: 2,
  focusOutlineOffset: 2,
} as const;
