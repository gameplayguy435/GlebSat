import { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, CardContent,
  TextField, Button, useTheme, Paper, InputAdornment
} from '@mui/material';
import { Mail, Phone, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useReCaptchaV3 } from './services/ReCaptchaV3';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Contacts = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { validateReCaptcha } = useReCaptchaV3();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      enqueueSnackbar('Email inválido!', { variant: 'error' });
      return;
    }
    if (!formData.subject || !formData.message) {
      enqueueSnackbar('Preencha todos os campos!', { variant: 'error' });
      return;
    }

    const recaptchaToken = await validateReCaptcha('contact');
    if (!recaptchaToken) {
      enqueueSnackbar('Erro ao validar reCAPTCHA!', { variant: 'error' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, recaptcha_token: recaptchaToken }),
      });
  
      const data = await response.json();

      if (data.success) {
        console.log('Email enviado com sucesso!');
        enqueueSnackbar(
          "Email enviado com sucesso!", 
          { variant: 'success', autoHideDuration: 3000 }
        );
        setSubmitted(true);
      } else {
        console.error('Erro ao enviar o email:', data.message);
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      enqueueSnackbar('Erro de conexão ao enviar o email', { variant: 'error' });
    }
  };

  const fixLeafletIcon = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  };
  
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const schoolPosition = [41.0644, -8.5761559];

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }} className="contacts-container">
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          textAlign: 'center',
          mb: 8
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          fontWeight="bold" 
          className="color-primary"
        >
          Contacte-nos
        </Typography>
        
        <Typography 
          variant="h6"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="color-secondary"
          sx={{ 
            maxWidth: '700px', 
            mx: 'auto', 
            mt: 2,
            mb: 6,
            px: 2
          }}
        >
          Tem questões sobre o projeto ou interesse em colaborar? Estamos disponíveis para o esclarecer.
        </Typography>
      </Box>
      
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card 
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              elevation={3} 
              className="bg-secondary"
              sx={{ 
                borderRadius: 4, 
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '8px', 
                  bgcolor: 'primary.main' 
                }}
              />
              
              <CardContent sx={{ p: 4, pt: 5 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" className="color-primary">
                  Fale Connosco
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ mb: 4, opacity: 0.8 }} className="color-secondary">
                  Utilize um dos nossos canais de contacto abaixo ou preencha o formulário para nos enviar uma mensagem direta.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 5 }}>
                  <Box 
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        p: 1.5, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <Mail fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" className="color-primary">
                        Email
                      </Typography>
                      <Typography variant="body2" className="color-secondary">
                        canpansatpat@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        p: 1.5, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <Phone fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" className="color-primary">
                        Telefone
                      </Typography>
                      <Typography variant="body2" className="color-secondary">
                        +351 969 207 733
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    whileHover={{ x: 5 }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        p: 1.5, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <LocationOn fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" className="color-primary">
                        Morada
                      </Typography>
                      <Typography variant="body2" className="color-secondary">
                        R. Moeiro s/n, 4415-133 Pedroso, Vila Nova de Gaia
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 7 }}>
            <Card 
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              elevation={3} 
              className="bg-secondary"
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '8px', 
                  bgcolor: 'primary.main' 
                }}
              />

              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" className="color-primary">
                  Envie-nos uma Mensagem
                </Typography>
                
                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ mt: 4 }}
                >
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        className="color-secondary"
                        component={motion.div}
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                        name="name"
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: 'var(--border-main)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'var(--text-secondary)',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--text-secondary)',
                          },
                          mb: 2
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        className="color-secondary"
                        component={motion.div}
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                        name="email"
                        label="Email *"
                        variant="outlined"
                        fullWidth
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: 'var(--border-main)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'var(--text-secondary)',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--text-secondary)',
                          },
                          mb: 2
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        className="color-secondary"
                        component={motion.div}
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                        name="subject"
                        label="Assunto *"
                        variant="outlined"
                        fullWidth
                        value={formData.subject}
                        onChange={handleChange}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: 'var(--border-main)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'var(--text-secondary)',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--text-secondary)',
                          },
                          mb: 2
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        className="color-secondary"
                        component={motion.div}
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                        name="message"
                        label="Mensagem *"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: 'var(--border-main)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'var(--text-secondary)',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--text-secondary)',
                          },
                          mb: 3
                        }}
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <Button
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ 
                          py: 1.5, 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1.1rem'
                        }}
                        disabled={submitted}
                      >
                        {submitted ? 'Mensagem Enviada' : 'Enviar Mensagem'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{ mt: 8 }}
        >          
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden', 
              height: '400px',
              position: 'relative'
            }}
            className="map-card bg-tertiary"
          >
            <MapContainer 
              center={schoolPosition} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={schoolPosition}>
                <Popup>
                  Colégio Internato dos Carvalhos<br/>
                  R. Moeiro s/n, 4415-133 Pedroso<br/>
                  Vila Nova de Gaia
                </Popup>
              </Marker>
            </MapContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

const ContactsPage = () => {
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
      <Contacts />
    </SnackbarProvider>
  );
}

export default ContactsPage;