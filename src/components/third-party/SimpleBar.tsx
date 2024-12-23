// material-ui
import { alpha, styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';
import { BrowserView, MobileView } from 'react-device-detect';
import { ReactNode } from 'react';

// root style
const RootStyle = styled(BrowserView)({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
});

// scroll bar wrapper
const SimpleBarStyle = styled(SimpleBar)(({ theme }: { theme: Theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': { backgroundColor: alpha(theme.palette.secondary.main, 0.25) },
    '&.simplebar-visible:before': { opacity: 1 },
  },
  '& .simplebar-track.simplebar-vertical': { width: 10 },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 6 },
  '& .simplebar-mask': { zIndex: 'inherit' },
}));

// ==============================|| SIMPLE SCROLL BAR  ||============================== //

interface SimpleBarScrollProps extends SimpleBarProps {
  children: ReactNode;
  sx?: object;
}

export default function SimpleBarScroll({ children, sx, ...other }: SimpleBarScrollProps) {
  return (
    <>
      <RootStyle>
        <SimpleBarStyle clickOnTrack={false} sx={sx} {...other}>
          {children}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
          {children}
        </Box>
      </MobileView>
    </>
  );
}
