// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| CUSTOM FUNCTION - COLOR SHADOWS ||============================== //

export default function getShadow(theme: Theme, shadow: string) {
  switch (shadow) {
    case 'secondary':
      return theme.customShadows?.secondary || theme.shadows[1];
    case 'error':
      return theme.customShadows?.error || theme.shadows[1];
    case 'warning':
      return theme.customShadows?.warning || theme.shadows[1];
    case 'info':
      return theme.customShadows?.info || theme.shadows[1];
    case 'success':
      return theme.customShadows?.success || theme.shadows[1];
    case 'primaryButton':
      return theme.customShadows?.primaryButton || theme.shadows[1];
    case 'secondaryButton':
      return theme.customShadows?.secondaryButton || theme.shadows[1];
    case 'errorButton':
      return theme.customShadows?.errorButton || theme.shadows[1];
    case 'warningButton':
      return theme.customShadows?.warningButton || theme.shadows[1];
    case 'infoButton':
      return theme.customShadows?.infoButton || theme.shadows[1];
    case 'successButton':
      return theme.customShadows?.successButton || theme.shadows[1];
    default:
      return theme.customShadows?.primary || theme.shadows[1];
  }
}
