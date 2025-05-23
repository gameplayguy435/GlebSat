import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2 as Grid
} from '@mui/material';
import { 
  ArrowBack, 
  AssignmentRounded, 
  HourglassTopRounded, 
  HourglassBottomRounded, 
  Timer, 
  Thermostat, 
  Compress, 
  Waves, 
  Height, 
  Co2 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import SensorChart from './components/SensorChart';
import { demoSensorData, demoTrajectoryData } from './internals/data/sensorData';

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
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishingMission, setFinishingMission] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  useEffect(() => {
    const fetchMissionData = async () => {
      setLoading(true);
      try {
        const missionResponse = await fetch(`${API_URL}/mission/${missionId}`);
        const missionData = await missionResponse.json();
        
        if (missionData.success) {
          setMission(missionData.mission);
          console.log("Mission data:", missionData.mission);

          const isRealtimeMission = missionData.mission.is_realtime;
          setIsLive(isRealtimeMission && !missionData.mission.end_date);
          
          const recordsResponse = await fetch(`${API_URL}/mission/${missionId}/records`);
          const recordsData = await recordsResponse.json();
          
          if (recordsData.success && recordsData.records.length > 0) {
            const processedData = processSensorData(recordsData.records, missionData.mission.start_date);
            setSensorData(processedData);
            
            const trajectory = processedData.trajectoryData;
            if (trajectory && trajectory.length > 0) {
              setTrajectoryData(trajectory);
            } else {
              setTrajectoryData(demoTrajectoryData);
            }
          } else {
            setSensorData(demoSensorData);
            setTrajectoryData(demoTrajectoryData);
          }
        } else {
          setError("Erro ao carregar os dados da missão");
        }
      } catch (err) {
        console.error("Error fetching mission data:", err);
        setError("Erro ao carregar os dados da missão");
        
        const fakeMission = {
          id: missionId || 1,
          name: "GlebSat Alpha",
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

  const calculateTimeDifference = (timestamp, missionStartDate) => {
    if (!timestamp || !missionStartDate) return 0;
    
    const recordTime = new Date(timestamp.replace(' ', 'T'));
    const startTime = new Date(missionStartDate);
    
    return Math.floor((recordTime.getTime() - startTime.getTime()) / 1000);
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

    console.log(missionStartDate);
    
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Dados indisponíveis';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Dados indisponíveis';

      const fullDate = date.toLocaleTimeString('pt-PT', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });

      return fullDate;
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

  const handleFinishMissionClick = () => {
    setFinishDialogOpen(true);
  };

  const handleFinishMissionConfirm = async () => {
    setFinishingMission(true);
    
    try {
      const response = await fetch(`${API_URL}/mission/${missionId}/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMission(result.mission);
        setIsLive(false);
        setFinishDialogOpen(false);
        // enqueueSnackbar
        enqueueSnackbar();
        console.log('Missão terminada com sucesso!');
      } else {
        console.error('Erro ao terminar missão:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('Error finishing mission:', err);
      setError('Erro ao terminar a missão');
    } finally {
      setFinishingMission(false);
    }
  };

  const handleFinishMissionCancel = () => {
    setFinishDialogOpen(false);
  };

  useEffect(() => {
    if (isLive && mission?.start_date) {
      const interval = setInterval(() => {
        setMission(prev => ({...prev}));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLive, mission]);

  const getMapCenter = () => {
    if (trajectoryData.length > 0) {
      return trajectoryData[trajectoryData.length - 1];
    }
    return [41.0644, -8.5762];
  };

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
        {!isLive && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/missions')}
            startIcon={<ArrowBack />}
            disabled={isLive}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 'normal',
              ...(isLive && {
                opacity: 0.5,
                cursor: 'not-allowed'
              })
            }}
          >
            Ver Missões
          </Button>
        )}
      </Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography component="h1" variant="h4">
          {mission.name}
        </Typography>
        
        {isLive && (
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleFinishMissionClick}
            disabled={finishingMission}
          >
            {finishingMission ? 'A terminar...' : 'Terminar Missão'}
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
        <Typography component="h1" variant="h4" fontWeight="medium">
          Trajetória do Satélite
        </Typography>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ height: 300, position: 'relative' }}>
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
                        Posição Atual <br/>
                        Latitude: {trajectoryData[trajectoryData.length - 1][0].toFixed(6)} <br/>
                        Longitude: {trajectoryData[trajectoryData.length - 1][1].toFixed(6)} <br/>
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
      
      <Typography component="h1" variant="h4" sx={{ mb: 2 }} fontWeight="medium">
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
      </Grid>

      <Dialog
          open={finishDialogOpen}
          onClose={handleFinishMissionCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
              sx: {
                  borderRadius: 2,
                  backgroundImage: 'none',
                  overflow: 'hidden',
                  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
              },
          }}
      >
          <DialogTitle
              sx={{
                  px: 4,
                  py: 3,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
              }}
          >
              Terminar Missão
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
              <Typography variant="body1" sx={{ m: 4 }}>
                Tem a certeza que pretende terminar a missão "{mission?.name}"?
              </Typography>
          </DialogContent>
          <DialogActions
              sx={{
                  px: 4,
                  py: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  gap: 1,
              }}
          >
              <Button
                  onClick={handleFinishMissionCancel}
                  disabled={finishingMission}
                  variant="outlined"
                  sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 'normal',
                  }}
              >
                  Cancelar
              </Button>
              <Button
                  onClick={handleFinishMissionConfirm} 
                  variant="contained" 
                  color="error"
                  disabled={finishingMission}
                  sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 'normal',
                  }}
              >
                  {finishingMission ? 'A terminar...' : 'Terminar Missão'}
              </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}