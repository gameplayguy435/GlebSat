import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardMedia, CircularProgress, Button,
  useTheme, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Air,
  ArrowBack,
  AssignmentRounded,
  Co2,
  Compress,
  Height,
  HourglassBottomRounded,
  HourglassTopRounded,
  Thermostat,
  Timer,
  Waves,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { demoSensorData, demoTrajectoryData } from './internals/data/sensorData';
import SensorChart from './components/SensorChart';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const MissionInfoCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

export default function ViewMissions() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [trajectoryData, setTrajectoryData] = useState([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Update the useEffect to fetch mission data
  useEffect(() => {
    const fetchMissionData = async () => {
      setLoading(true);
      try {
        // Fetch mission details
        const missionResponse = await fetch(`${API_URL}/mission/${missionId}`);
        const missionData = await missionResponse.json();
        
        if (missionData.success) {
          setMission(missionData.mission);

          const isRealtimeMission = missionData.mission.is_realtime;
          setIsLive(isRealtimeMission && !missionData.mission.end_date);
          
          // Fetch records for the mission
          const recordsResponse = await fetch(`${API_URL}/mission/${missionId}/records`);
          const recordsData = await recordsResponse.json();
          
          if (recordsData.success && recordsData.records.length > 0) {
            // Process the records into sensor data
            const processedData = processSensorData(recordsData.records);
            setSensorData(processedData);
            
            // Extract trajectory data
            const trajectory = processedData.trajectoryData;
            if (trajectory && trajectory.length > 0) {
              setTrajectoryData(trajectory);
            } else {
              // Fallback to demo data
              setTrajectoryData(demoTrajectoryData);
            }
          } else {
            // No real data available, use demo data
            setSensorData(demoSensorData);
            setTrajectoryData(demoTrajectoryData);
          }
        } else {
          setError("Erro ao carregar os dados da missão");
        }
      } catch (err) {
        console.error("Error fetching mission data:", err);
        setError("Erro ao carregar os dados da missão");
        
        // Use demo data as fallback
        const fakeMission = {
          id: missionId || 1,
          name: "Missão Estratosférica Alpha",
          start_date: new Date().toISOString(),
          end_date: isLive ? null : new Date(Date.now() + 300000).toISOString(),
          duration: isLive ? null : "00:05:00"
        };
        
        setSensorData(demoSensorData);
        setTrajectoryData(demoTrajectoryData);
        setMission(fakeMission);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMissionData();

    let pollingInterval;
    if (isLive) {
      pollingInterval = setInterval(fetchMissionData, 5000);
    }
    
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [missionId, isLive]);

  // Add this function to process the records into sensor data
  const processSensorData = (records) => {
    // Initialize data arrays for each sensor type
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
    
    const particles = {
      series: [],
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      trend: 'neutral',
      trendLabel: '0%',
      unit: "µg/m³"
    };
    
    // Extract timestamps and trajectory data
    const timeLabels = [];
    const trajectoryData = [];
    
    // Process each record
    records.forEach((record) => {
      const data = record.data;
      
      // Extract timestamp for labels
      if (data.timestamp) {
        const date = new Date(data.timestamp);
        const index = timeLabels.length;
        timeLabels.push(`${index}s`);
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
      
      if (data.particles_ug_m3 !== undefined) {
        const particlesValue = Number(data.particles_ug_m3);
        if (!isNaN(particlesValue)) {
          particles.series.push(particlesValue);
          particles.min = Math.min(particles.min, particlesValue);
          particles.max = Math.max(particles.max, particlesValue);
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
    
    // Calculate trends for each sensor
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
    
    // Set current values and trends
    temperature.current = temperature.series.length > 0 ? temperature.series[temperature.series.length - 1].toFixed(1) : '0';
    const tempTrend = calculateTrend(temperature.series);
    temperature.trend = tempTrend.trend;
    temperature.trendLabel = tempTrend.trendLabel;
    
    pressure.current = pressure.series.length > 0 ? pressure.series[pressure.series.length - 1].toFixed(1) : '0';
    const pressureTrend = calculateTrend(pressure.series);
    pressure.trend = pressureTrend.trend;
    pressure.trendLabel = pressureTrend.trendLabel;
    
    humidity.current = humidity.series.length > 0 ? humidity.series[humidity.series.length - 1].toFixed(0) : '0';
    const humidityTrend = calculateTrend(humidity.series);
    humidity.trend = humidityTrend.trend;
    humidity.trendLabel = humidityTrend.trendLabel;
    
    altitude.current = altitude.series.length > 0 ? altitude.series[altitude.series.length - 1].toFixed(0) : '0';
    const altitudeTrend = calculateTrend(altitude.series);
    altitude.trend = altitudeTrend.trend;
    altitude.trendLabel = altitudeTrend.trendLabel;
    
    co2.current = co2.series.length > 0 ? co2.series[co2.series.length - 1].toFixed(0) : '0';
    const co2Trend = calculateTrend(co2.series);
    co2.trend = co2Trend.trend;
    co2.trendLabel = co2Trend.trendLabel;
    
    particles.current = particles.series.length > 0 ? particles.series[particles.series.length - 1].toFixed(1) : '0';
    const particlesTrend = calculateTrend(particles.series);
    particles.trend = particlesTrend.trend;
    particles.trendLabel = particlesTrend.trendLabel;
    
    // Return the processed sensor data
    return {
      timeLabels,
      temperature,
      pressure,
      humidity,
      altitude,
      co2,
      particles,
      trajectoryData
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Dados indisponíveis';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Dados indisponíveis';

      const time = date.toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${time} ${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Dados indisponíveis';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Dados indisponíveis';
    
    try {
      if (mission?.start_date && !mission?.end_date) {
        const start = new Date(mission.start_date);
        const now = new Date();
        const diffSeconds = Math.floor((now - start) / 1000);
        const minutes = Math.floor(diffSeconds / 60);
        const seconds = diffSeconds % 60;
        
        if (minutes === 0) {
          return `${seconds} seg`;
        } else if (seconds === 0) {
          return `${minutes} min`;
        } else {
          return `${minutes} min ${seconds} seg`;
        }
      }
      
      if (duration.includes(':')) {
        const parts = duration.split(':');
        if (parts.length >= 2) {
          const minutes = parseInt(parts[1], 10);
          const seconds = parseInt(parts[2]?.split('.')[0] || '0', 10);
          
          if (minutes === 0) {
            return `${seconds} seg`;
          } else if (seconds === 0) {
            return `${minutes} min`;
          } else {
            return `${minutes} min ${seconds} seg`;
          }
        }
      }
      
      return duration;
    } catch (error) {
      console.error("Error formatting duration:", error);
      return 'Dados indisponíveis';
    }
  };

  const handleEndMission = () => {
    setIsLive(false);
    setMission(prev => ({
      ...prev,
      end_date: new Date().toISOString(),
      duration: "00:05:00"
    }));
  };

  useEffect(() => {
    if (isLive && mission?.start_date) {
      const interval = setInterval(() => {
        setMission(prev => ({...prev}));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLive, mission]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/missions')}
          startIcon={<ArrowBack />}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'normal',
          }}
        >
          Ver Missões
        </Button>
      </Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography component="h1" variant="h4" fontWeight="medium">
          {mission.name}
        </Typography>
        
        {isLive && (
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleEndMission}
          >
            Terminar Missão
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <MissionInfoCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentRounded color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Nº da Missão
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <Typography variant="h5" fontWeight="medium">
                {mission.id}
              </Typography>
            </Typography>
          </MissionInfoCard>
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <MissionInfoCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HourglassTopRounded color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Início da Missão
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {formatDate(mission.start_date)}
            </Typography>
          </MissionInfoCard>
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <MissionInfoCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HourglassBottomRounded color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Fim da Missão
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {isLive ? "Em progresso" : formatDate(mission.end_date)}
            </Typography>
          </MissionInfoCard>
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <MissionInfoCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Duração
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {isLive ? (
                <Box component="span" sx={{ 
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 }
                  }
                }}>
                  {formatDuration(mission.duration)} (em tempo real)
                </Box>
              ) : formatDuration(mission.duration)}
            </Typography>
          </MissionInfoCard>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Última Imagem Recebida
            </Typography>
            <CardMedia
              component="img"
              height="300"
              image="/images/glebsat-front.png"
              alt="Última imagem da missão"
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Recebida há 45 segundos
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Trajetória do Satélite
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <MapContainer 
                center={[41.0644, -8.5762]} 
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
                        Posição Atual <br/>
                        Altitude: {sensorData.altitude.current} {sensorData.altitude.unit}
                      </Popup>
                    </Marker>
                  </>
                )}
              </MapContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Condições Atmosféricas
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
          <SensorChart 
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
        
        <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
          <SensorChart 
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
        
        <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
          <SensorChart 
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
        
        <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
          <SensorChart 
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
        
        <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
          <SensorChart 
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
        
        <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
          <SensorChart 
            title="Partículas Finas"
            value={sensorData.particles.current}
            unit={sensorData.particles.unit}
            trend={sensorData.particles.trend}
            trendLabel={sensorData.particles.trendLabel}
            data={sensorData.particles.series}
            timeLabels={sensorData.timeLabels}
            color={theme.palette.success.main}
            icon={<Air color="success" />}
            minValue={0}
            maxValue={sensorData.particles.max * 1.3}
          />
        </Grid>
      </Grid>
    </Box>
  );
}