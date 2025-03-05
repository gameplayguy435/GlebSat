import Stack from '@mui/material/Stack';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ThemeToggle from '../../ThemeToggle';
import ColorModeIconDropdown from '../assets/shared-theme/ColorModeIconDropdown';

export default function Header() {
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
        {/* TROCAR DATEPICKER PARA SÓ DATA ATUAL + ARRANJAR OUTRO PICKER PARA INPUTS*/}
        <CustomDatePicker />
        <ThemeToggle />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
