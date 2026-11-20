/**
 * Application layering scale aligned with the current MUI z-index defaults.
 * Use these tokens for app-owned overlays; MUI components retain theme defaults.
 */
export const UI_Z_INDEX = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const;
