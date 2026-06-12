import type { ThemeOptions } from '@mui/material/styles';

export const GbaDarkTheme: ThemeOptions = {
  // media queries
  isLargerThanPhone: 'only screen and (min-width: 600px)',
  isMobileLandscape:
    'only screen and (max-height: 450px) and (max-width: 1000px) and (orientation: landscape)',
  isMobileWithUrlBar:
    'only screen and (max-height: 700px) and (orientation: portrait)',

  // css colors
  checkMarkGreen: '#7ac142',
  darkCharcoal: '#0f172a',
  disabledGray: '#64748b',
  errorRed: '#ef4444',
  gbaThemeBlue: '#3b82f6',
  mediumBlack: '#020617',
  menuHighlight: 'rgba(51, 65, 85, 0.55)',
  menuHover: '#cbd5e1',
  pattensBlue: '#e2e8f0',
  pureBlack: '#020617',
  pureWhite: '#fff',
  panelControlGray: '#1e293b',
  panelBlueGray: '#0f172a',
  panelControlText: '#e2e8f0',
  panelSliderAccent: '#3b82f6',

  // new canonical css colors
  modalSurface: '#0f172a',
  modalSurfaceElevated: '#1e293b',
  modalBorder: '#1e293b',
  modalBorderStrong: '#475569',
  modalTextPrimary: '#f1f5f9',
  modalTextSecondary: '#94a3b8',
  surfaceTextPrimary: '#f1f5f9',
  modalIconMuted: '#94a3b8',
  modalHoverSurface: '#1e293b',
  modalDropzoneSurface: '#0f172a',
  modalSectionSurface: '#0f172a',
  modalSectionBorder: '#1e293b',
  modalListBorder: '#334155',
  modalListItemHoverSurface: '#1e293b',
  modalCloseButtonHoverSurface: '#1e293b',
  modalCloseButtonHoverBorder: '#334155',
  modalContainerSurface: '#0c1121',
  focusRingPrimary: 'rgba(59, 130, 246, 0.28)',
  focusRingPrimarySoft: 'rgba(59, 130, 246, 0.2)',
  menuBackdrop: 'rgba(2, 6, 23, 0.72)',
  menuToggleFocusRing: 'rgba(59, 130, 246, 0.28)',
  modalTabBorder: '#1e293b',
  errorOverlay: 'rgba(2, 6, 23, 0.64)',
  virtualControlSurface: '#1e293b',
  virtualControlSurfaceStrong: '#334155',
  virtualControlBorderSubtle: 'rgba(148, 163, 184, 0.24)',
  virtualControlInnerBorder: 'rgba(226, 232, 240, 0.08)',
  virtualControlButtonSurface: '#1e293b',
  virtualControlButtonSurfacePill: '#334155',
  virtualControlShadow:
    '0 10px 28px rgba(2, 6, 23, 0.38), inset 0 1px 0 rgba(226, 232, 240, 0.08)',
  virtualControlPressedShadow: '0 8px 18px rgba(2, 6, 23, 0.3)',
  virtualControlAccentBorder: 'rgba(59, 130, 246, 0.5)',
  virtualControlAccentBorderStrong: 'rgba(59, 130, 246, 0.6)',
  virtualControlAccentHalo: 'rgba(59, 130, 246, 0.14)',
  virtualControlArrow: 'rgba(241, 245, 249, 0.82)',

  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0c1121',
      paper: '#0f172a'
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8'
    },
    error: {
      main: '#ef4444'
    }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          boxShadow: 'none'
        },
        contained: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#3b82f6',
            boxShadow: 'none'
          },
          '&:active': {
            backgroundColor: '#1d4ed8'
          },
          '&.Mui-disabled': {
            backgroundColor: '#1e293b',
            color: '#64748b'
          }
        },
        outlined: {
          border: '1px solid #334155',
          color: '#f1f5f9',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#1e293b',
            borderColor: '#475569'
          },
          '&.Mui-disabled': {
            borderColor: '#1e293b',
            color: '#64748b'
          }
        },
        text: {
          color: '#94a3b8',
          '&:hover': {
            backgroundColor: '#1e293b'
          }
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#f1f5f9'
          }
        }
      }
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#3b82f6',
          height: '2px'
        }
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          '&:hover': {
            backgroundColor: '#1e293b'
          }
        }
      }
    }
  }
};
