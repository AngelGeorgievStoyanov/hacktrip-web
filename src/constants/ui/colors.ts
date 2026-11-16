/**
 * Semantic application color tokens.
 * Values intentionally preserve the current blue/white visual identity.
 * Components should consume semantic roles from UI_COLORS; do not add flat aliases.
 */
export const UI_COLORS = {
  brand: {
    primary: '#1976d2',
    primaryHover: '#4daf30',
  },
  surface: {
    page: '#cfe8fc',
    card: '#eee7e79e',
    stickySocial: '#eee7e79e',
    socialOverlay: 'rgba(24, 31, 26, 0.82)',
    socialOverlayBorder: 'rgba(255,255,255,0.22)',
    socialOverlayHover: 'rgba(255,255,255,0.16)',
    socialPlaceholder: '#e7f0f2',
    imageLightbox: 'rgba(17, 17, 17, 0.96)',
    imageControl: 'rgba(0, 0, 0, 0.45)',
    imageControlHover: 'rgba(0, 0, 0, 0.7)',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.2)',
    strong: '#000',
  },
  text: {
    inverse: '#fff',
    primary: '#17212b',
    onSecondary: '#000',
  },
  action: {
    danger: 'red',
    dangerHover: '#ef0a0a',
    secondaryBackground: 'rgb(194 194 224)',
    secondaryHoverText: 'rgb(248 245 245)',
    imageControlBackground: '#ffffffaa',
    imageControlBackgroundHover: '#ffffff',
    tripImageControlBackground: 'rgba(255, 255, 255, 0.82)',
    tripImageControlBackgroundHover: 'rgba(255, 255, 255, 0.96)',
    contrastBackground: '#000',
    createTripBackground: '#0e0d0d',
    createTripText: '#f3eeee',
    createTripHoverBackground: '#f3eeee',
    createTripHoverText: '#0e0d0d',
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
    socialPlaceholderOverlay: 'linear-gradient(transparent, rgba(15, 35, 45, 0.72))',
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
