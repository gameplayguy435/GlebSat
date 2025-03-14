import { useEffect, useState, useRef } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, CardContent, 
  Paper, Button, LinearProgress, useTheme 
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowForward, VideoCall, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const [isStreaming, setIsStreaming] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });
  
  const targetDate = new Date('2025-05-12T00:00:00');
  
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeRemaining({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }
      
      const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
      const horas = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((difference / (1000 * 60)) % 60);
      const segundos = Math.floor((difference / 1000) % 60);
      
      setTimeRemaining({ dias, horas, minutos, segundos });
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Sample data for charts
  const timeSeriesData = [
    { time: '00:00', aqi: 45, temp: 22, humidity: 65, pressure: 1012 },
    { time: '04:00', aqi: 48, temp: 21, humidity: 68, pressure: 1013 },
    { time: '08:00', aqi: 52, temp: 23, humidity: 72, pressure: 1014 },
    { time: '12:00', aqi: 55, temp: 25, humidity: 70, pressure: 1012 },
    { time: '16:00', aqi: 49, temp: 24, humidity: 67, pressure: 1011 },
    { time: '20:00', aqi: 47, temp: 22, humidity: 64, pressure: 1010 },
  ];
  
  const pieData = [
    { name: 'N₂', value: 78 },
    { name: 'O₂', value: 21 },
    { name: 'CO₂', value: 0.04 },
    { name: 'Other', value: 0.96 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // GPS trajectory data
  const trajectoryPoints = [
    [41.0644, -8.5761559],
    [41.062, -8.579],
    [41.061, -8.578],
    [41.059, -8.576],
    [41.059, -8.573],
  ];

  const scrollToMetrics = () => {
    document.getElementById('metrics-dashboard')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <Box sx={{ minHeight: '100vh' }} className="home-container">
      {/* Hero Section with Video and Countdown */}
      <Box
        className="hero-section"
        sx={{
          position: 'relative',
          height: { xs: 'auto', md: '80vh' }, // Auto height on mobile, fixed height on larger screens
          minHeight: { xs: '100vh', md: '80vh' }, // Ensure minimum height on all screens
          display: 'flex',
          alignItems: 'center',
          mb: 6,
          boxShadow: 8,
          py: { xs: 12, md: 4 } // Add vertical padding on mobile to ensure content fits
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center" justifyContent="center">
            <Grid size={{ xs: 12, lg: 6 }} className="text-center hero-grid">
              <Typography 
                component={motion.h1}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                variant="h2" 
                fontWeight="bold" 
                gutterBottom
                className="color-primary"
              >
                GlebSat
              </Typography>
              <Typography 
                component={motion.h1}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                variant="h4"
                fontWeight="bold"
                gutterBottom
                className="color-secondary"
              >
                A lata que desafia limites
              </Typography>
              <Typography 
                component={motion.p}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                variant="h6" 
                sx={{ mb: 4, opacity: 0.9 }}
                className="color-primary"
              >
                Monitorização ambiental em tempo real a partir do espaço para proteger o futuro do nosso planeta
              </Typography>
              
                <Button 
                  component={motion.button}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  variant="contained" 
                  size="large" 
                  endIcon={<ArrowForward />}
                  className="hero-button"
                  sx={{ px: 4, py: 1.5 }}
                  onClick={scrollToMetrics}
                >
                  Saber Mais
                </Button>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }} sx={{ mx: 'auto' }}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                elevation={12}
                className="countdown-container"
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  backdropFilter: 'blur(10px)',
                  p: { xs: 2, sm: 3, md: 4 } // Smaller padding on mobile
                }}
              >
                {isStreaming ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '300px',
                    justifyContent: 'center'
                  }}>
                    <VideoCall sx={{ fontSize: 60, mb: 2 }} className="accent-icon" />
                    <Typography variant="h5" align="center" gutterBottom>
                      Transmissão em Direto Disponível
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                      Ver Agora
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                      Próximo Lançamento da Missão
                    </Typography>
                    
                    <AccessTime sx={{ fontSize: 40, my: 2 }} className="accent-icon" />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      flexWrap: 'wrap', // Enable wrapping on small screens
                      mt: 3,
                      mb: 2
                    }}>
                      {Object.entries(timeRemaining).map(([unit, value]) => (
                        <Box 
                          key={unit} 
                          sx={{ 
                            textAlign: 'center', 
                            px: { xs: 1, sm: 2 }, // Smaller padding on mobile
                            mb: { xs: 2, sm: 0 }, // Add margin bottom on mobile for wrapped items
                            width: { xs: '50%', sm: 'auto' } // Take up half width on mobile, auto on larger
                          }}
                        >
                          <Paper 
                            elevation={6} 
                            className="countdown-digit"
                            sx={{
                              p: { xs: 2, sm: 1}, // Smaller padding on mobile
                              borderRadius: 2, 
                              minWidth: { xs: '45px', sm: '60px' }, // Smaller min width on mobile
                              mx: 'auto', // Center the paper in its container
                              maxWidth: '90%' // Prevent horizontal overflow
                            }}
                          >
                            <Typography 
                              variant="h4" 
                              fontWeight="bold"
                              sx={{ 
                                fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.125rem' } // Smaller font on mobile
                              }}
                            >
                              {value.toString().padStart(2, '0')}
                            </Typography>
                          </Paper>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 1, 
                              textTransform: 'uppercase',
                              fontSize: { xs: '0.7rem', sm: '0.875rem' } // Smaller label on mobile
                            }}
                          >
                            {unit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
                      12 de Maio de 2025 • Carvalhos, Vila Nova de Gaia
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Metrics Dashboard */}
      <Container maxWidth="xl" sx={{ mb: 8 }} id="metrics-dashboard">
        <Typography variant="h4" fontWeight="bold" gutterBottom mb={4} className="color-primary">
          Painel de Monitorização Ambiental
        </Typography>
        
        <Grid container spacing={3}>
          {/* Key Metrics Cards - Keep colorful for visual distinctions */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }} >
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              elevation={4} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', // Keep specific colors for metrics
                color: 'white', // White text is acceptable when on colorful background
                height: '100%'
              }}
              className="dashboard-card"
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="500">
                  Índice de Qualidade do Ar
                </Typography>
                <Typography variant="h3" fontWeight="bold" my={2}>
                  45
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={45} 
                  sx={{ 
                    mb: 1, 
                    height: 8, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }
                  }} 
                />
                <Typography variant="body2">
                  Bom - Atualizado há 2 minutos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              elevation={4} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)', // Keep specific colors for metrics
                color: 'white', // White text is acceptable when on colorful background
                height: '100%'
              }}
              className="dashboard-card"
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="500">
                  Temperatura
                </Typography>
                <Typography variant="h3" fontWeight="bold" my={2}>
                  22°C
                </Typography>
                <Typography variant="body2">
                  Nível da Superfície - precisão de ±0.5°C
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              elevation={4} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)', // Keep specific colors for metrics
                color: 'white', // White text is acceptable when on colorful background
                height: '100%'
              }}
              className="dashboard-card"
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="500">
                  Níveis de CO<sub>2</sub>
                </Typography>
                <Typography variant="h3" fontWeight="bold" my={2}>
                  412ppm
                </Typography>
                <Typography variant="body2">
                  Estável - aumento anual de 0.8%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              elevation={4} 
              sx={{ 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)', // Keep specific colors for metrics
                color: 'white', // White text is acceptable when on colorful background
                height: '100%'
              }}
              className="dashboard-card"
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="500">
                  Humidade
                </Typography>
                <Typography variant="h3" fontWeight="bold" my={2}>
                  65%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  sx={{ 
                    mb: 1, 
                    height: 8, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }
                  }} 
                />
                <Typography variant="body2">
                  Moderada - 3% acima da média
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Charts */}
          <Grid size={{ xs: 12, lg: 6}}>
            <Card 
              elevation={3} 
              sx={{ borderRadius: 2, p: 2, height: '100%' }}
              className="chart-card bg-tertiary"
            >
              <Typography variant="h6" gutterBottom fontWeight="medium" className="color-primary">
                Análise Ambiental de 24 Horas
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)' }} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="#8884d8" 
                      fillOpacity={0.3} 
                      fill="#8884d8" 
                      name="Índice de Qualidade do Ar"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#82ca9d" 
                      fillOpacity={0.3} 
                      fill="#82ca9d" 
                      name="Temperatura (°C)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#ffc658" 
                      fillOpacity={0.3} 
                      fill="#ffc658"
                      name="Humidade (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, lg: 6}}>
            <Card 
              elevation={3} 
              sx={{ borderRadius: 2, p: 2, height: '100%' }}
              className="chart-card bg-tertiary"
            >
              <Typography variant="h6" gutterBottom fontWeight="medium" className="color-primary">
                Trajetória do Satélite
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)' }} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="#8884d8" 
                      fillOpacity={0.3} 
                      fill="#8884d8" 
                      name="Índice de Qualidade do Ar"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#82ca9d" 
                      fillOpacity={0.3} 
                      fill="#82ca9d" 
                      name="Temperatura (°C)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#ffc658" 
                      fillOpacity={0.3} 
                      fill="#ffc658" 
                      name="Humidade (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          
          {/* GPS Trajectory Map */}
          <Grid size={{ xs: 12 }}>
            <Card 
              elevation={3} 
              sx={{ borderRadius: 2, height: '400px', overflow: 'hidden' }}
              className="map-card bg-tertiary"
            >
              <CardContent sx={{ height: '100%', p: 0 }}>
                <Typography variant="h6" p={2} gutterBottom fontWeight="medium" className="color-primary">
                  Trajetória do Satélite
                </Typography>
                <Box sx={{ height: 'calc(100% - 48px)' }}>
                  <MapContainer 
                    center={[41.0644, -8.5761559]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Polyline 
                      positions={trajectoryPoints} 
                      color="blue" 
                      weight={3} 
                      opacity={0.7} 
                    />
                    <Marker position={trajectoryPoints[trajectoryPoints.length - 1]}>
                      <Popup>
                        Posição Atual
                      </Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Page Sections Preview */}
      <Box sx={{ py: 8 }} className="bg-tertiary sections-preview">
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom mb={5} className="color-primary">
            Conheça o nosso projeto!
          </Typography>
          
          {/* About Us Section */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: false }}
            sx={{ mb: 8 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, lg: 6}}>
                <Box
                  component="img"
                  src="/images/glebsat-equipa1.jpg"
                  alt="About Us"
                  sx={{ 
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: 4,
                    objectFit: 'cover',
                    height: 300
                  }}
                  className="image-overlay"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6}}>
                <Typography variant="h5" gutterBottom fontWeight="bold" className="color-primary">
                  Sobre Nós
                </Typography>
                <Typography variant="body1" paragraph className="color-secondary">
                  Somos uma equipa de cientistas e engenheiros apaixonados, dedicados à monitorização das condições ambientais da Terra a partir do espaço. 
                  A nossa missão é fornecer dados precisos e em tempo real para ajudar a combater as alterações climáticas e promover práticas sustentáveis.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/about"
                  sx={{ mt: 1 }}
                >
                  Conheça a Nossa Equipa
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {/* News Section */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: false }}
            sx={{ mb: 8 }}
          >
            <Grid container spacing={4} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid size={{ xs: 12, lg: 6}}>
                <Typography variant="h5" gutterBottom fontWeight="bold" className="color-primary">
                  Últimas Notícias
                </Typography>
                <Typography variant="body1" paragraph className="color-secondary">
                  Mantenha-se atualizado com o progresso da nossa missão, descobertas científicas e informações ambientais. 
                  A nossa secção de notícias fornece atualizações regulares sobre implementações de satélites, 
                  descobertas de análise de dados e projetos de investigação colaborativa.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/news"
                  sx={{ mt: 1 }}
                >
                  Leia as Nossas Últimas Atualizações
                </Button>
              </Grid>
              <Grid size={{ xs: 12, lg: 6}}>
                <Box
                  component="img"
                  src="/images/glebsat-front.png"
                  alt="News"
                  sx={{ 
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: 4,
                    objectFit: 'cover',
                    height: 300
                  }}
                  className="image-overlay"
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Gallery Section */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: false }}
            sx={{ mb: 8 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, lg: 6}}>
                <Box
                  component="img"
                  src="/images/david.jpg"
                  alt="Gallery"
                  sx={{ 
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: 4,
                    objectFit: 'cover',
                    height: 300
                  }}
                  className="image-overlay"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6}}>
                <Typography variant="h5" gutterBottom fontWeight="bold" className="color-primary">
                  Galeria de Imagens
                </Typography>
                <Typography variant="body1" paragraph className="color-secondary">
                  Explore a jornada visual da nossa missão através de impressionantes imagens de satélite, 
                  fotografias de equipamentos, eventos da equipa e vistas deslumbrantes da Terra a partir do espaço. 
                  A nossa galeria mostra a beleza do nosso planeta e a tecnologia que usamos para o monitorizar.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/gallery"
                  sx={{ mt: 1 }}
                >
                  Explorar a Nossa Galeria
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {/* Contact Section */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: false }}
          >
            <Grid container spacing={4} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid size={{ xs: 12, lg: 6}}>
                <Typography variant="h5" gutterBottom fontWeight="bold" className="color-primary">
                  Contacte-nos
                </Typography>
                <Typography variant="body1" paragraph className="color-secondary">
                  Tem questões sobre a nossa missão ou interesse em colaborar? 
                  Gostaríamos muito de o ouvir. A nossa equipa está disponível para discutir parcerias, acesso a dados, 
                  oportunidades educativas e mais informações sobre as nossas iniciativas de monitorização ambiental.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/contact"
                  sx={{ mt: 1 }}
                >
                  Entre em Contacto
                </Button>
              </Grid>
              <Grid size={{ xs: 12, lg: 6}}>
                <Box
                  component="img"
                  src="/images/glebsat-logo.jpg"
                  alt="Contact"
                  sx={{ 
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: 4,
                    objectFit: 'cover',
                    height: 300
                  }}
                  className="image-overlay"
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;