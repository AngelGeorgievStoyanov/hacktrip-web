/** Shared application font tokens. Keep the existing stack until font loading is audited. */
export const TYPOGRAPHY = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.02857em',
    lineHeight: 1.75,
    textTransform: 'uppercase',
  },
} as const;
