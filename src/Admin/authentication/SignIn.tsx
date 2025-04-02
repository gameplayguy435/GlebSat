import { useState, useEffect, FormEvent } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card as MuiCard,
  Checkbox,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
import AppTheme from '../assets/shared-theme/AppTheme';
// import ColorModeSelect from '../assets/shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import ThemeToggle from '../../ThemeToggle';
import { SatelliteAltRounded } from '@mui/icons-material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: theme.spacing(2) + 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
  'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
    'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  position: 'relative',
  overflow: 'auto',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'fixed',
    zIndex: -1,
    inset: 0,
    backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const URL = import.meta.env.VITE_BACKEND_API_URL + '/login';

const SignIn = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/admin', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const formData = {
      email: email,
      password: password,
    };
    const response = await axios.post(URL, formData);
    if (response.data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', email);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.name);
      navigate('/admin/content', { replace: true });
    } else {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('email', '');
      localStorage.setItem('userId', '');
      localStorage.setItem('username', '');
      alert(response.data.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Insira um endereço de email válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('A palavra passe deve conter pelo menos 8 caracteres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Box
          sx={{
            position: 'absolute',
            top: '3rem',
            right: '3rem',
            zIndex: 1100,
            display: 'flex'
          }}
        >
          <ThemeToggle />
        </Box>
        <Card variant="outlined">
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <SatelliteAltRounded />
            <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
              GlebSat
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="a12345@gmail.com"
                autoComplete="off"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Palavra passe</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="off"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Manter sessão iniciada"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Entrar
            </Button>
            {/* <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Esqueceu-se da sua palavra passe?
            </Link> */}
          </Box>
          <Divider>ou</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Entre com o Google')}
              startIcon={<GoogleIcon />}
            >
              Entre com o Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Entre com o Facebook')}
              startIcon={<FacebookIcon />}
            >
              Entre com o Facebook
            </Button> */}
            <Typography sx={{ textAlign: 'center' }}>
              Ainda não criou uma conta?{' '}
              <Link
                href="/admin/signup"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Registe-se
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}

export default SignIn;