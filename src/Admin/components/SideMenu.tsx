import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <Button
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<HomeRoundedIcon />}
          fullWidth
          sx={{
            justifyContent: 'center',
            textAlign: 'left',
            maxHeight: 56,
            width: 215,
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 500,
            pl: 1.5,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Ver Página Principal
        </Button>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="David Vieira"
          src="/images/david.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            { localStorage.getItem('username') }
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            { localStorage.getItem('email') }
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
