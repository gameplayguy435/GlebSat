import { useState, useEffect, FormEvent } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card as MuiCard,
  CircularProgress,
  CssBaseline,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SatelliteAltRounded } from '@mui/icons-material';
import AppTheme from '../../assets/shared-theme/AppTheme';
import ThemeToggle from '../../../components/ThemeToggle';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useReCaptchaV3 } from '../../../services/ReCaptchaV3';

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

const ResetPasswordContainer = styled(Stack)(({ theme }) => ({
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

const URL = import.meta.env.VITE_BACKEND_API_URL;

const ResetPasswordContent = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { validateReCaptcha } = useReCaptchaV3();
  
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');

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

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const recaptchaToken = await validateReCaptcha('reset_password');
      if (!recaptchaToken) {
        enqueueSnackbar('Erro ao validar reCAPTCHA.', { variant: 'error' });
        setIsSubmitting(false);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');

      if (!token || !email) {
        enqueueSnackbar('Link de redefinição inválido.', { variant: 'error' });
        return;
      }

      const form = e.target as HTMLFormElement;
      const newpassword = form.newpassword.value;

      const response = await axios.post(`${URL}/complete-reset-password`, {
        token: token,
        email: email,
        password: newpassword,
        recaptcha_token: recaptchaToken
      });

      if (response.data.success) {
        enqueueSnackbar('Palavra-passe redefinida com sucesso!', { variant: 'success' });
        setTimeout(() => {
          navigate('/admin/login');
        }, 1500);
      } else {
        enqueueSnackbar(response.data.message || 'Erro ao redefinir palavra-passe.', { variant: 'error' });
      }
    } catch (err) {
      console.error('Erro ao redefinir palavra passe.', err);
      enqueueSnackbar('Erro ao redefinir palavra passe.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateInputs = () => {
    const newpassword = document.getElementById('newpassword') as HTMLInputElement;
    const confirmnewpassword = document.getElementById('confirmnewpassword') as HTMLInputElement;

    let isValid = true;

    if (!newpassword.value || newpassword.value.length < 8) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage('A palavra passe deve conter pelo menos 8 caracteres.');
      enqueueSnackbar('A palavra passe deve conter pelo menos 8 caracteres.', { variant: 'error' });
      isValid = false;
    } else {
      if (newpassword.value !== confirmnewpassword.value) {
        setNewPasswordError(true);
        setNewPasswordErrorMessage('As palavras passe não coincidem.');
        enqueueSnackbar('As palavras passe não coincidem.', { variant: 'error' });
        isValid = false;
      }
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ResetPasswordContainer direction="column">
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
            sx={{ width: '100%', fontSize: 'clamp(1.5rem, 8vw, 2rem)' }}
          >
            Redefinir Palavra Passe
          </Typography>
          <Box
            component="form"
            onSubmit={handleResetPassword}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="newpassword">Nova palavra passe</FormLabel>
              <TextField
                error={newPasswordError}
                helperText={newPasswordErrorMessage}
                name="newpassword"
                placeholder="••••••"
                type="password"
                id="newpassword"
                autoComplete="off"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={newPasswordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmnewpassword">Confirmar nova palavra passe</FormLabel>
              <TextField
                error={newPasswordError}
                helperText={newPasswordErrorMessage}
                name="confirmnewpassword"
                placeholder="••••••"
                type="password"
                id="confirmnewpassword"
                autoComplete="off"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={newPasswordError ? 'error' : 'primary'}
                sx={{ mb: 2 }}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
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
              {isSubmitting ? 'A processar...' : 'Guardar'}
            </Button>
          </Box>
        </Card>
      </ResetPasswordContainer>
    </AppTheme>
  );
}

const ResetPassword = () => {
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
      <ResetPasswordContent />
    </SnackbarProvider>
  );
}

export default ResetPassword;