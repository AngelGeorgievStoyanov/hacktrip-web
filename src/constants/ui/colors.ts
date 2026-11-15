/** Central application color tokens. Existing values are preserved during migration. */
export const COLORS = {
  /** Legacy page fallback background behind the random background image. */
  pageBackground: '#cfe8fc',
  /** Primary brand blue used by the AppBar, footer and primary actions. */
  brand: '#1976d2',
  /** Legacy translucent card/panel surface; migrate usages to semantic surfaces. */
  cardBackground: '#eee7e79e',
  /** Legacy translucent comment-card surface. */
  commentCardBackground: '#eee7e7cc',
  /** Legacy authentication form surface. */
  formPanelBackground: '#e5e3e3d9',
  /** Legacy dialog surface. */
  dialogBackground: '#eee7e7',
  /** Translucent background for the trip sticky social-actions surface. */
  stickySocialBackground: '#eee7e79e',
  /** Shared legacy contained-button hover color. */
  buttonHover: '#4daf30',
  /** Legacy destructive-action hover color. */
  dangerHover: '#ef0a0a',
  /** Legacy secondary button surface and hover text colors. */
  secondaryButtonBackground: 'rgb(194 194 224)',
  secondaryButtonHoverText: 'rgb(248 245 245)',
  secondaryButtonHoverBackground: 'rgb(170 170 210)',
  textLight: '#fff',
  textDark: '#17212b',
  legalLink: '#174f7a',
  legalBorder: 'rgb(23 33 43 / 22%)',
  legalBackBackground: 'rgb(194 194 224)',
  headingShadow: 'rgb(10 10 10)',
  /** Shared address autocomplete input surface and text colors. */
  mapAddressInputBackground: '#f2f1e58f',
  mapAddressInputText: '#222',
  mapAddressInputLabel: '#333',
  mapAddressInputBorder: 'rgba(0, 0, 0, 0.35)',
  mapAddressInputBorderHover: 'rgba(0, 0, 0, 0.7)',
} as const;
