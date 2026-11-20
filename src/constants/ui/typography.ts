/** Display face retained for legacy branded headings and editorial treatments. */
export const DISPLAY_FONT_FAMILY = 'Space Mono, monospace' as const;

/**
 * Shared application typography tokens.
 * Variant values match the existing MUI defaults so centralization does not
 * introduce a visual redesign. Keep the current font stack until font loading
 * and the About page's editorial font are separately reviewed.
 */
export const TYPOGRAPHY = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: { fontSize: '6rem', fontWeight: 300, lineHeight: 1.167, letterSpacing: '-0.01562em' },
  h2: { fontSize: '3.75rem', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.00833em' },
  h3: { fontSize: '3rem', fontWeight: 400, lineHeight: 1.167, letterSpacing: '0' },
  h4: { fontSize: '2.125rem', fontWeight: 400, lineHeight: 1.235, letterSpacing: '0.00735em' },
  h5: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.334, letterSpacing: '0' },
  h6: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6, letterSpacing: '0.0075em' },
  subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.75, letterSpacing: '0.00938em' },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.00714em' },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.00938em' },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43, letterSpacing: '0.01071em' },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.02857em',
    lineHeight: 1.75,
    textTransform: 'uppercase',
  },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66, letterSpacing: '0.03333em' },
  overline: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 2.66, letterSpacing: '0.08333em' },
} as const;

/**
 * About-page editorial typography. Kept separate from the application-wide MUI scale
 * because this page intentionally uses its existing Space Mono visual identity.
 * Values are exposed to CSS Modules through theme-generated custom properties.
 */
export const ABOUT_EDITORIAL_TYPOGRAPHY = {
  fontFamily: "'Space Mono', monospace",
  fontWeight: 600,
  headingMargin: '8px 0',
  h1: 'clamp(1.7rem, 4vw, 2.5rem)',
  h2: 'clamp(1.2rem, 2.5vw, 1.7rem)',
  h3: 'clamp(1rem, 2vw, 1.25rem)',
  h3LineHeight: 1.6,
} as const;
