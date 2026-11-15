/**
 * Semantic application color tokens.
 * Values intentionally preserve the current blue/white visual identity.
 * Components should consume semantic roles; COLORS below remains only as a
 * compatibility mapping for older imports and must not be used by new code.
 */
export const UI_COLORS = {
  brand: {
    primary: '#1976d2',
    primaryHover: '#4daf30',
  },
  surface: {
    page: '#cfe8fc',
    card: '#eee7e79e',
    commentCard: '#eee7e7cc',
    formPanel: '#e5e3e3d9',
    dialog: '#eee7e7',
    stickySocial: '#eee7e79e',
    socialOverlay: 'rgba(24, 31, 26, 0.82)',
    socialOverlayBorder: 'rgba(255,255,255,0.22)',
    socialOverlayHover: 'rgba(255,255,255,0.16)',
    imageLightbox: 'rgba(17, 17, 17, 0.96)',
    imageControl: 'rgba(0, 0, 0, 0.45)',
    imageControlHover: 'rgba(0, 0, 0, 0.7)',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.2)',
  },
  text: {
    inverse: '#fff',
    primary: '#17212b',
  },
  action: {
    danger: 'red',
    dangerHover: '#ef0a0a',
    secondaryBackground: 'rgb(194 194 224)',
    secondaryHoverText: 'rgb(248 245 245)',
    secondaryHoverBackground: 'rgb(170 170 210)',
    imageControlBackground: '#ffffffaa',
    imageControlBackgroundHover: '#ffffff',
    tripImageControlBackground: 'rgba(255, 255, 255, 0.82)',
    tripImageControlBackgroundHover: 'rgba(255, 255, 255, 0.96)',
    contrastBackground: '#000',
    navigationSelectedBackground: 'rgba(255, 255, 255, 0.2)',
    navigationHoverBackground: 'rgba(255, 255, 255, 0.1)',
  },
  legal: {
    link: '#174f7a',
    border: 'rgb(23 33 43 / 22%)',
    backBackground: 'rgb(194 194 224)',
  },
  decorative: {
    headingShadow: 'rgb(10 10 10)',
  },
  map: {
    addressBackground: '#f2f1e58f',
    addressText: '#222',
    addressLabel: '#333',
    addressBorder: 'rgba(0, 0, 0, 0.35)',
    addressBorderHover: 'rgba(0, 0, 0, 0.7)',
    pickerHintBackground: 'rgba(255, 255, 255, 0.92)',
  },
} as const;

/**
 * Backward-compatible names for existing components.
 * Do not add new consumers of this flat legacy object.
 */
export const COLORS = {
  pageBackground: UI_COLORS.surface.page,
  brand: UI_COLORS.brand.primary,
  cardBackground: UI_COLORS.surface.card,
  commentCardBackground: UI_COLORS.surface.commentCard,
  formPanelBackground: UI_COLORS.surface.formPanel,
  dialogBackground: UI_COLORS.surface.dialog,
  stickySocialBackground: UI_COLORS.surface.stickySocial,
  buttonHover: UI_COLORS.brand.primaryHover,
  dangerHover: UI_COLORS.action.dangerHover,
  secondaryButtonBackground: UI_COLORS.action.secondaryBackground,
  secondaryButtonHoverText: UI_COLORS.action.secondaryHoverText,
  secondaryButtonHoverBackground: UI_COLORS.action.secondaryHoverBackground,
  textLight: UI_COLORS.text.inverse,
  textDark: UI_COLORS.text.primary,
  legalLink: UI_COLORS.legal.link,
  legalBorder: UI_COLORS.legal.border,
  legalBackBackground: UI_COLORS.legal.backBackground,
  headingShadow: UI_COLORS.decorative.headingShadow,
  mapAddressInputBackground: UI_COLORS.map.addressBackground,
  mapAddressInputText: UI_COLORS.map.addressText,
  mapAddressInputLabel: UI_COLORS.map.addressLabel,
  mapAddressInputBorder: UI_COLORS.map.addressBorder,
  mapAddressInputBorderHover: UI_COLORS.map.addressBorderHover,
} as const;
