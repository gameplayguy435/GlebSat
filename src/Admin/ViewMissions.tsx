import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardMedia, CircularProgress, Paper, Button,
  Divider, useTheme, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { LineChart, AreaChart, areaElementClasses } from '@mui/x-charts';
import Chip from '@mui/material/Chip';
import MapIcon from '@mui/icons-material/Map';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CompressIcon from '@mui/icons-material/Compress';
import WavesIcon from '@mui/icons-material/Waves';
import HeightIcon from '@mui/icons-material/Height';
import Co2Icon from '@mui/icons-material/Co2';
import AirIcon from '@mui/icons-material/Air';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import { styled } from '@mui/material/styles';
import Copyright from './internals/components/Copyright';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { demoSensorData, demoTrajectoryData } from './internals/data/sensorData';
import SessionsChart from './components/SessionsChart';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
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
        setLoading(false);
      } catch (err) {
        console.error("Error setting up mission view:", err);
        setError("Erro ao carregar os dados da missão");
        setLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [missionId, isLive]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Em progresso';
    
    try {
      const date = new Date(dateString);
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
      return dateString;
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '00:00';
    
    try {
      if (mission?.start_date && !mission?.end_date) {
        const start = new Date(mission.start_date);
        const now = new Date();
        const diffSeconds = Math.floor((now - start) / 1000);
        const minutes = Math.floor(diffSeconds / 60).toString().padStart(2, '0');
        const seconds = (diffSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
      }
      
      if (duration.includes(':')) {
        const parts = duration.split(':');
        if (parts.length >= 2) {
          return `${parts[1]}:${parts[2].split('.')[0]}`;
        }
      }
      
      return duration;
    } catch (error) {
      console.error("Error formatting duration:", error);
      return duration;
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
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Nº da Missão
              </Typography>
              <Typography variant="h5" fontWeight="medium">
                {mission.id}
              </Typography>
            </Box>
          </MissionInfoCard>
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <MissionInfoCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRangeIcon color="primary" />
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
              <AccessTimeIcon color="primary" />
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
              <TimerIcon color="primary" />
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
        <Grid size={{ xs: 12, md: 6 }}>
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
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
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
                  <Polyline 
                    positions={trajectoryData} 
                    color={theme.palette.primary.main} 
                    weight={3} 
                    opacity={0.8}
                  />
                )}
                {trajectoryData.length > 0 && (
                  <Marker position={trajectoryData[trajectoryData.length - 1]}>
                    <Popup>
                      Posição Atual <br/>
                      Altitude: {sensorData.altitude.current} {sensorData.altitude.unit}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </Box>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Altitude atual: {sensorData.altitude.current} {sensorData.altitude.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Condições Atmosféricas
      </Typography>
      
      <Grid container spacing={3}>
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
            icon={<ThermostatIcon color="error" />}
            minValue={0}
            maxValue={sensorData.temperature.max * 1.2}
            tickInterval={1}
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
            icon={<CompressIcon color="info" />}
            minValue={sensorData.pressure.min * 0.90}
            maxValue={sensorData.pressure.max * 1.1}
            tickInterval={5}
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
            icon={<WavesIcon color="primary" />}
            minValue={0}
            maxValue={100}
            tickInterval={10}
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
            icon={<HeightIcon color="secondary" />}
            minValue={0}
            maxValue={sensorData.altitude.max * 1.2}
            tickInterval={50}
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
            icon={<Co2Icon color="warning" />}
            minValue={sensorData.co2.min * 0.8}
            maxValue={sensorData.co2.max * 1.2}
            tickInterval={15}
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
            icon={<AirIcon color="success" />}
            minValue={0}
            maxValue={sensorData.particles.max * 1.3}
            tickInterval={10}
          />
        </Grid>
      </Grid>
      
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}