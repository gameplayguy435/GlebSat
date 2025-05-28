import { useEffect, useState } from 'react';
import { useNavigate, Outlet, redirect } from 'react-router-dom';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import {
  Box,
  CircularProgress,
  CssBaseline,
  Stack,
} from '@mui/material';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from './assets/shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import axios from 'axios';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const URL = import.meta.env.VITE_BACKEND_API_URL;

const Dashboard = (props:any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyUser();
  }, [navigate]);

  const verifyUser = async () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/admin/login', { replace: true });
    } else {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');

      if (!userId) {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('email', '');
        localStorage.setItem('userId', '');
        localStorage.setItem('username', '');
        navigate('/admin/login', { replace: true });
        return;
      }

      const response = await axios.get(`${URL}/user/${userId}`);
      if (!response.data.success) {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('email', '');
        localStorage.setItem('userId', '');
        localStorage.setItem('username', '');
        navigate('/admin/login', { replace: true });
        return;
      }

      const user = response.data.user;
      if (user.email !== email || user.name !== username) {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('email', '');
        localStorage.setItem('userId', '');
        localStorage.setItem('username', '');
        navigate('/admin/login', { replace: true });
        return;
      }

      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 0,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default Dashboard;