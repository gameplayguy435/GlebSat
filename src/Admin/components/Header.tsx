import { useState } from 'react';
import Stack from '@mui/material/Stack';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ThemeToggle from '../../components/ThemeToggle';
// import ColorModeIconDropdown from '../assets/shared-theme/ColorModeIconDropdown';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { Box, Chip, Icon, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt';

dayjs.locale('pt');

export default function Header() {
  const value = dayjs().startOf('day');
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>        
        <CustomDatePicker textAlign="center" disabled={true}/>
        <ThemeToggle />
      </Stack>
    </Stack>
  );
}
