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
import { SatelliteAltRounded } from '@mui/icons-material';
import ForgotPassword from './components/ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import AppTheme from '../assets/shared-theme/AppTheme';
import ThemeToggle from '../../components/ThemeToggle';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useReCaptchaV3 } from '../../services/ReCaptchaV3';

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
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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

const SignInContent = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { validateReCaptcha } = useReCaptchaV3();
  
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      const recaptchaToken = await validateReCaptcha('login');
      if (!recaptchaToken) {
        enqueueSnackbar('Erro ao validar reCAPTCHA.', { variant: 'error' });
        return;
      }

      const form = e.target as HTMLFormElement;
      const email = form.email.value;
      const password = form.password.value;
      const formData = {
        email: email,
        password: password,
        recaptcha_token: recaptchaToken,
      };

      const response = await axios.post(URL, formData);

      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', email);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.name);
        navigate('/admin', { replace: true });
      } else {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('email', '');
        localStorage.setItem('userId', '');
        localStorage.setItem('username', '');
        enqueueSnackbar('Erro ao iniciar sessão.', { variant: 'error' });
      }
    } catch (err) {
      console.error('Erro ao iniciar sessão.', err);
      enqueueSnackbar('Erro ao iniciar sessão.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
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
      setPasswordErrorMessage('A palavra-passe deve conter pelo menos 8 caracteres.');
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
      <SignInContainer direction="column">
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
              <FormLabel htmlFor="password">Palavra-passe</FormLabel>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{
                '&.Mui-disabled': {
                  color: theme => theme.palette.mode === 'dark' 
                    ? 'rgba(0, 0, 0, 0.6)'
                    : 'rgba(255, 255, 255, 0.8)',
                }
              }}
            >
              {isSubmitting ? 'A processar...' : 'Entrar'}
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Esqueceu-se da sua palavra-passe?
            </Link>
          </Box>
          {/* <Divider>ou</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
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
            </Button>
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
          </Box> */}
        </Card>
        <ForgotPassword open={open} handleClose={handleClose} />
      </SignInContainer>
    </AppTheme>
  );
}

const SignIn = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      preventDuplicate
    >
      <SignInContent />
    </SnackbarProvider>
  );
}

export default SignIn;