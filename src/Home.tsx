import { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, CardContent, 
  Paper, Button, LinearProgress, useTheme, CircularProgress, Alert
} from '@mui/material';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowForward, VideoCall, AccessTime, 
  Air, Co2, Compress, Height, Thermostat, Waves
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FrontSensorChart from './components/FrontSensorChart';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

const HomePage = () => {
  const theme = useTheme();

  const [isStreaming, setIsStreaming] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mission, setMission] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [trajectoryData, setTrajectoryData] = useState([]);
  
  const targetDate = new Date('2025-05-28T09:00:00');
  
  useEffect(() => {
    fixLeafletIcon();
    
    const fetchLatestMissionData = async () => {
      setLoading(true);
      try {
        const missionsResponse = await fetch(`${API_URL}/mission`);
        const missionsData = await missionsResponse.json();
        
        if (missionsData.success && missionsData.missions.length > 0) {
          const completedMissions = missionsData.missions
            .filter(mission => mission.end_date)
            .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
            
          if (completedMissions.length > 0) {
            const latestMission = completedMissions[0];
            setMission(latestMission);
            
            const recordsResponse = await fetch(`${API_URL}/mission/${latestMission.id}/records`);
            const recordsData = await recordsResponse.json();
            
            if (recordsData.success && recordsData.records.length > 0) {
              const processedData = processSensorData(recordsData.records, latestMission.start_date);
              setSensorData(processedData);
              
              const trajectory = processedData.trajectoryData;
              if (trajectory && trajectory.length > 0) {
                setTrajectoryData(trajectory);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching mission data:", err);
        setError("Erro ao carregar os dados da missão");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestMissionData();
  }, []);

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

  const calculateTimeDifference = (timestamp, missionStartDate) => {
    if (!timestamp || !missionStartDate) return 0;
    
    const recordTime = new Date(timestamp);
    const startTime = new Date(missionStartDate);
    
    return Math.max(Math.floor((recordTime.getTime() - startTime.getTime()) / 1000), 0);
  };

  const processSensorData = (records, missionStartDate) => {
    const temperature = {
      series: [],
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      trend: 'neutral',
      trendLabel: '0%',
      unit: "°C"
    };
    
    const pressure = {
      series: [],
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      trend: 'neutral',
      trendLabel: '0%',
      unit: "hPa"
    };
    
    const humidity = {
      series: [],
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      trend: 'neutral',
      trendLabel: '0%',
      unit: "%"
    };
    
    const altitude = {
      series: [],
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      trend: 'neutral',
      trendLabel: '0%',
      unit: "m"
    };
    
    const co2 = {
      series: [],
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      trend: 'neutral',
      trendLabel: '0%',
      unit: "ppm"
    };
    
    const timeLabels = [];
    const trajectoryData = [];
    
    records.forEach((record) => {
      const data = record.data;
      
      if (data.timestamp && missionStartDate) {
        const timeDiff = calculateTimeDifference(data.timestamp, missionStartDate);
        timeLabels.push(`${timeDiff}s`);
      }
      
      if (data.temperature_c !== undefined) {
        const tempValue = Number(data.temperature_c);
        if (!isNaN(tempValue)) {
          temperature.series.push(tempValue);
          temperature.min = Math.min(temperature.min, tempValue);
          temperature.max = Math.max(temperature.max, tempValue);
        }
      }
      
      if (data.pressure_hpa !== undefined) {
        const pressureValue = Number(data.pressure_hpa);
        if (!isNaN(pressureValue)) {
          pressure.series.push(pressureValue);
          pressure.min = Math.min(pressure.min, pressureValue);
          pressure.max = Math.max(pressure.max, pressureValue);
        }
      }

      if (data.humidity_percent !== undefined) {
        const humidityValue = Number(data.humidity_percent);
        if (!isNaN(humidityValue)) {
          humidity.series.push(humidityValue);
          humidity.min = Math.min(humidity.min, humidityValue);
          humidity.max = Math.max(humidity.max, humidityValue);
        }
      }
      
      if (data.altitude_m !== undefined) {
        const altitudeValue = Number(data.altitude_m);
        if (!isNaN(altitudeValue)) {
          altitude.series.push(altitudeValue);
          altitude.min = Math.min(altitude.min, altitudeValue);
          altitude.max = Math.max(altitude.max, altitudeValue);
        }
      }
      
      if (data.co2_ppm !== undefined) {
        const co2Value = Number(data.co2_ppm);
        if (!isNaN(co2Value)) {
          co2.series.push(co2Value);
          co2.min = Math.min(co2.min, co2Value);
          co2.max = Math.max(co2.max, co2Value);
        }
      }
      
      if (data.latitude !== undefined && data.longitude !== undefined) {
        const latitude = Number(data.latitude);
        const longitude = Number(data.longitude);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          trajectoryData.push([latitude, longitude]);
        }
      }
    });
    
    const calculateTrend = (series) => {
      if (series.length < 2) return { trend: 'neutral', trendLabel: '0%' };
      
      const first = series[0];
      const last = series[series.length - 1];
      const percentChange = ((last - first) / first) * 100;
      
      let trend = 'neutral';
      if (percentChange > 3) {
        trend = 'up';
      } else if (percentChange < -3) {
        trend = 'down';
      }
      
      return { 
        trend, 
        trendLabel: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%` 
      };
    };
    
    temperature.current = temperature.series.length > 0 ? temperature.series[temperature.series.length - 1].toFixed(1).replace('.', ',') : '0';
    const tempTrend = calculateTrend(temperature.series);
    temperature.trend = tempTrend.trend;
    temperature.trendLabel = tempTrend.trendLabel;
    
    pressure.current = pressure.series.length > 0 ? pressure.series[pressure.series.length - 1].toFixed(1).replace('.', ',') : '0';
    const pressureTrend = calculateTrend(pressure.series);
    pressure.trend = pressureTrend.trend;
    pressure.trendLabel = pressureTrend.trendLabel;
    
    humidity.current = humidity.series.length > 0 ? humidity.series[humidity.series.length - 1].toFixed(0).replace('.', ',') : '0';
    const humidityTrend = calculateTrend(humidity.series);
    humidity.trend = humidityTrend.trend;
    humidity.trendLabel = humidityTrend.trendLabel;
    
    altitude.current = altitude.series.length > 0 ? altitude.series[altitude.series.length - 1].toFixed(0).replace('.', ',') : '0';
    const altitudeTrend = calculateTrend(altitude.series);
    altitude.trend = altitudeTrend.trend;
    altitude.trendLabel = altitudeTrend.trendLabel;
    
    co2.current = co2.series.length > 0 ? co2.series[co2.series.length - 1].toFixed(0).replace('.', ',') : '0';
    const co2Trend = calculateTrend(co2.series);
    co2.trend = co2Trend.trend;
    co2.trendLabel = co2Trend.trendLabel;
    
    return {
      timeLabels,
      temperature,
      pressure,
      humidity,
      altitude,
      co2,
      trajectoryData
    };
  };

  const scrollToMetrics = () => {
    document.getElementById('metrics-dashboard')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const getMapCenter = () => {
    if (trajectoryData.length > 0) {
      return trajectoryData[trajectoryData.length - 1];
    }
    return [41.0644, -8.5762];
  };

  return (
    <Box sx={{ minHeight: '100vh' }} className="home-container">
      <Box
        className="hero-section"
        sx={{
          position: 'relative',
          height: { xs: 'auto', md: 'auto' },
          minHeight: { xs: '100vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          mb: 6,
          boxShadow: 8,
          py: { xs: 12, md: 4 }
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
                Monitorização ambiental em tempo real para proteger o futuro do nosso planeta
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
                  p: { xs: 2, sm: 3, md: 4 }
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
                      Apresentação do GlebSat
                    </Typography>
                    
                    <AccessTime sx={{ fontSize: 40, my: 2 }} className="accent-icon" />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      flexWrap: 'wrap',
                      mt: 3,
                      mb: 2
                    }}>
                      {Object.entries(timeRemaining).map(([unit, value]) => (
                        <Box 
                          key={unit} 
                          sx={{ 
                            textAlign: 'center', 
                            px: { xs: 1, sm: 2 },
                            mb: { xs: 2, sm: 0 },
                            width: { xs: '50%', sm: 'auto' }
                          }}
                        >
                          <Paper 
                            elevation={6} 
                            className="countdown-digit"
                            sx={{
                              p: { xs: 2, sm: 1},
                              borderRadius: 2, 
                              minWidth: { xs: '45px', sm: '60px' },
                              mx: 'auto',
                              maxWidth: '90%'
                            }}
                          >
                            <Typography 
                              variant="h4" 
                              fontWeight="bold"
                              sx={{ 
                                fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.125rem' }
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
                              fontSize: { xs: '0.7rem', sm: '0.875rem' }
                            }}
                          >
                            {unit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
                      28 de Maio de 2025 • Carvalhos, Vila Nova de Gaia
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mb: 8 }} id="metrics-dashboard">
        <Typography variant="h4" fontWeight="bold" gutterBottom mb={4} className="color-primary" data-aos="fade-up">
          Monitorização Ambiental
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !sensorData ? (
          <Alert severity="info">Não existem dados disponíveis para mostrar.</Alert>
        ) : (
          <>            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, lg: 6, xl: 4 }} data-aos="fade-up">
                <FrontSensorChart 
                  title="Temperatura"
                  value={sensorData.temperature.current}
                  unit={sensorData.temperature.unit}
                  trend={sensorData.temperature.trend}
                  trendLabel={sensorData.temperature.trendLabel}
                  data={sensorData.temperature.series}
                  timeLabels={sensorData.timeLabels}
                  color={theme.palette.error.main}
                  icon={<Thermostat color="error" />}
                  minValue={0}
                  maxValue={sensorData.temperature.max * 1.2}
                />
              </Grid>
              
              <Grid size={{ xs: 12, lg: 6, xl: 4 }} data-aos="fade-up">
                <FrontSensorChart 
                  title="Pressão"
                  value={sensorData.pressure.current}
                  unit={sensorData.pressure.unit}
                  trend={sensorData.pressure.trend}
                  trendLabel={sensorData.pressure.trendLabel}
                  data={sensorData.pressure.series}
                  timeLabels={sensorData.timeLabels}
                  color={theme.palette.info.main}
                  icon={<Compress color="info" />}
                  minValue={sensorData.pressure.min * 0.90}
                  maxValue={sensorData.pressure.max * 1.1}
                />
              </Grid>
              
              <Grid size={{ xs: 12, lg: 6, xl: 4 }} data-aos="fade-up">
                <FrontSensorChart 
                  title="Humidade"
                  value={sensorData.humidity.current}
                  unit={sensorData.humidity.unit}
                  trend={sensorData.humidity.trend}
                  trendLabel={sensorData.humidity.trendLabel}
                  data={sensorData.humidity.series}
                  timeLabels={sensorData.timeLabels}
                  color={theme.palette.primary.main}
                  icon={<Waves color="primary" />}
                  minValue={0}
                  maxValue={100}
                />
              </Grid>
              
              <Grid size={{ xs: 12, lg: 6, xl: 4 }} data-aos="fade-up">
                <FrontSensorChart 
                  title="Altitude"
                  value={sensorData.altitude.current}
                  unit={sensorData.altitude.unit}
                  trend={sensorData.altitude.trend}
                  trendLabel={sensorData.altitude.trendLabel}
                  data={sensorData.altitude.series}
                  timeLabels={sensorData.timeLabels}
                  color={theme.palette.secondary.main}
                  icon={<Height color="secondary" />}
                  minValue={0}
                  maxValue={sensorData.altitude.max * 1.2}
                />
              </Grid>
              
              <Grid size={{ xs: 12, lg: 6, xl: 4 }} data-aos="fade-up">
                <FrontSensorChart 
                  title="Níveis de CO₂"
                  value={sensorData.co2.current}
                  unit={sensorData.co2.unit}
                  trend={sensorData.co2.trend}
                  trendLabel={sensorData.co2.trendLabel}
                  data={sensorData.co2.series}
                  timeLabels={sensorData.timeLabels}
                  color={theme.palette.warning.main}
                  icon={<Co2 color="warning" />}
                  minValue={sensorData.co2.min * 0.8}
                  maxValue={sensorData.co2.max * 1.2}
                />
              </Grid>
            </Grid>
            
            <Typography variant="h4" fontWeight="bold" gutterBottom mb={4} className="color-primary" data-aos="fade-up">
              Trajetória do Satélite
            </Typography>
            <Card 
              elevation={3} 
              sx={{ borderRadius: 2, height: '400px', overflow: 'hidden', mb: 4 }}
              className="map-card bg-tertiary"
              data-aos="fade-up"
            >
                <Box sx={{ height: '100%' }}>
                  <MapContainer 
                    key={`map-${trajectoryData.length}`}
                    center={getMapCenter()} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%', borderRadius: 0 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {trajectoryData.length > 0 && (
                      <>
                        <Polyline 
                          positions={trajectoryData} 
                          color={theme.palette.primary.main} 
                          weight={3} 
                          opacity={0.8}
                          smoothFactor={1}
                        />
                        <Marker position={trajectoryData[trajectoryData.length - 1]}>
                          <Popup>
                            Posição Final <br/>
                            Altitude: {sensorData.altitude.current} {sensorData.altitude.unit}
                          </Popup>
                        </Marker>
                      </>
                    )}
                  </MapContainer>
                </Box>
            </Card>
          </>
        )}
      </Container>

      <Box sx={{ py: 8 }} className="bg-tertiary sections-preview">
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom mb={5} className="color-primary">
            Conheça o nosso projeto!
          </Typography>
          
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
                  Somos uma equipa de estudantes ambiciosos, dedicados à monitorização das condições atmosféricas e ambientais da Terra. 
                  A nossa missão é fornecer dados precisos para ajudar a combater as alterações climáticas e promover práticas sustentáveis.
                </Typography>
                <Button 
                  variant="contained" 
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
                  Mantenha-se atualizado com o progresso da nossa missão, desenvolvimento científico e informações ambientais. 
                  A nossa secção de notícias fornece atualizações regulares sobre todo o projeto, incluindo missões realizadas, 
                  vertentes de desenvolvimento e informações da equipa.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/news"
                  sx={{ mt: 1 }}
                >
                  Leia as Nossas Últimas Notícias
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
                  Explora a jornada visual da nossa missão através de imagens representativas do nosso trabalho, 
                  fotografias de componentes e processos de desenvolvimento. 
                  A nossa galeria mostra o decorrer da missão que visamos concluir e a tecnologia de monitorização do ambiente.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/gallery"
                  sx={{ mt: 1 }}
                >
                  Explora a Nossa Galeria
                </Button>
              </Grid>
            </Grid>
          </Box>
          
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
                  variant="contained" 
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