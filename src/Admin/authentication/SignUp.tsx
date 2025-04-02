import { useState, useEffect, FormEvent } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card as MuiCard,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

const URL = import.meta.env.VITE_BACKEND_API_URL + '/register';

const SignUp = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  useEffect(() => {
    console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/admin/content', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('fullname') as HTMLInputElement;

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

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('O nome é obrigatório.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const form = e.target as HTMLFormElement;
    const name = form.fullname.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmpassword = form.confirmPassword.value;
    if (password !== confirmpassword) {
      alert('As palavras-passe não coincidem.');
      return;
    } else {
      const formData = {
        name: name,
        email: email,
        password: password,
      };
      console.log(formData);
      try {
        const response = await axios.post(URL, formData);
        if (response.data.success) {
          navigate('/admin/login');
        } else {
          alert(response.data.message);
        }
      } catch (exception) {
        console.error(exception);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
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
      <SignUpContainer direction="column" justifyContent="space-between">
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
            Registe-se
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="fullname">Nome completo</FormLabel>
              <TextField
                autoComplete="off"
                name="fullname"
                required
                fullWidth
                id="fullname"
                placeholder="David Vieira"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="a12345@gmail.com"
                name="email"
                autoComplete="off"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Palavra passe</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="off"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirmar palavra passe</FormLabel>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="••••••"
                type="password"
                id="confirmPassword"
                autoComplete="off"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Criar conta
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>ou</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Registe-se com o Google')}
              startIcon={<GoogleIcon />}
            >
              Registe-se com o Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Registe-se com o Facebook')}
              startIcon={<FacebookIcon />}
            >
              Registe-se com o Facebook
            </Button> */}
            <Typography sx={{ textAlign: 'center' }}>
              Já tem uma conta?{' '}
              <Link
                href="/admin/login"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Faça o Login
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}

export default SignUp;