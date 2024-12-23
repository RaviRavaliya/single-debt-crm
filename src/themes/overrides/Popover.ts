// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - POPOVER ||============================== //

export default function Popover(theme: Theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          // Add fallback if customShadows or z1 is undefined
          boxShadow: theme.customShadows?.z1 || theme.shadows[1]
        }
      }
    }
  };
}
