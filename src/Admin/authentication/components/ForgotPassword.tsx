import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { useReCaptchaV3 } from '../../../services/ReCaptchaV3';
import { FormControl, FormLabel } from '@mui/material';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { validateReCaptcha } = useReCaptchaV3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogEmailError, setDialogEmailError] = useState(false);
  const [dialogEmailErrorMessage, setDialogEmailErrorMessage] = useState('');
  const [dialogNameError, setDialogNameError] = useState(false);
  const [dialogNameErrorMessage, setDialogNameErrorMessage] = useState('');

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  const validateInputs = (email: string, fullname: string) => {
    let isValid = true;

    // Validar email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setDialogEmailError(true);
      setDialogEmailErrorMessage('Insira um email válido.');
      isValid = false;
    } else {
      setDialogEmailError(false);
      setDialogEmailErrorMessage('');
    }

    // Validar nome
    if (!fullname || fullname.trim().length < 3) {
      setDialogNameError(true);
      setDialogNameErrorMessage('Insira um nome completo válido.');
      isValid = false;
    } else {
      setDialogNameError(false);
      setDialogNameErrorMessage('');
    }

    return isValid;
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const fullname = formData.get('fullname') as string;

    if (!validateInputs(email, fullname)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar reCAPTCHA
      const recaptchaToken = await validateReCaptcha('reset_password');
      if (!recaptchaToken) {
        enqueueSnackbar('Erro ao validar reCAPTCHA.', { variant: 'error' });
        setIsSubmitting(false);
        return;
      }

      // Enviar pedido de redefinição ao servidor
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: fullname,
          recaptcha_token: recaptchaToken
        }),
      });

      const data = await response.json();

      if (data.success) {
        enqueueSnackbar('Instruções de redefinição enviadas para o seu email.', { variant: 'success' });
        handleClose();
      } else {
        enqueueSnackbar(data.message || 'Erro ao processar o pedido.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao redefinir palavra passe:', error);
      enqueueSnackbar('Erro de conexão ao servidor.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleResetPassword,
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Redefinir palavra passe</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', pt: 2 }}
      >
        <DialogContentText>
          Indique as suas credenciais e será enviado um link para redefinir a sua palavra passe.
        </DialogContentText>
        <FormControl>
          <FormLabel htmlFor="fullname" sx={{ mb: 0 }}>Nome completo</FormLabel>
          <TextField
            margin="dense"
            id="fullname"
            name="fullname"
            placeholder="David Vieira"
            type="text"
            fullWidth
            autoComplete="off"
            error={dialogNameError}
            helperText={dialogNameErrorMessage}
            disabled={isSubmitting}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email" sx={{ mb: 0 }}>Email</FormLabel>
          <TextField
            margin="dense"
            id="email"
            name="email"
            placeholder="a12345@gmail.com"
            type="email"
            fullWidth
            autoComplete="off"
            error={dialogEmailError}
            helperText={dialogEmailErrorMessage}
            disabled={isSubmitting}
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          type="submit" 
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
          {isSubmitting ? 'A processar...' : 'Continuar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}