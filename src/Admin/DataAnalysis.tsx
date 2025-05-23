import { useState, useEffect } from 'react';
import { 
  alpha,
  Alert,
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid2 as Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { 
  Air,
  Co2,
  Compress,
  Height, 
  Thermostat,
  Waves,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  Polyline,
  Popup,
  MapContainer,
  Marker,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MultiSensorChart from './components/MultiSensorChart';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

export default function DataAnalysis() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState(null);
  const [sensorsData, setSensorsData] = useState({
    timeLabels: [],
    temperature: { series: [], min: 0, max: 30, unit: "°C" },
    pressure: { series: [], min: 900, max: 1100, unit: "hPa" },
    humidity: { series: [], min: 0, max: 100, unit: "%" },
    altitude: { series: [], min: 0, max: 500, unit: "m" },
    co2: { series: [], min: 300, max: 1500, unit: "ppm" },
  });
  const [trajectoryData, setTrajectoryData] = useState([]);
  
  const missionColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main
  ];

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  useEffect(() => {
    const fetchMissionsData = async () => {
      setLoading(true);
      try {
        const missionsResponse = await fetch(`${API_URL}/mission`);
        const missionsData = await missionsResponse.json();
        
        if (missionsData.success) {
          const completedMissions = missionsData.missions
            .filter(mission => mission.end_date)
            .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())
            .slice(0, 3);
            
          setMissions(completedMissions);
          
          const missionsWithData = await Promise.all(
            completedMissions.map(async (mission) => {
              const recordsResponse = await fetch(`${API_URL}/mission/${mission.id}/records`);
              const recordsData = await recordsResponse.json();
              
              if (recordsData.success && recordsData.records.length > 0) {
                return {
                  ...mission,
                  records: recordsData.records
                };
              }
              return {
                ...mission,
                records: []
              };
            })
          );
          
          const processedData = processAllMissionsData(missionsWithData, missionColors);
          setSensorsData(processedData.sensorData);
          setTrajectoryData(processedData.trajectoryData);
        } else {
          setError("Erro ao carregar os dados das missões");
        }
      } catch (err) {
        console.error("Error fetching missions data:", err);
        setError("Erro ao carregar os dados das missões");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMissionsData();
  }, []);

  const calculateTimeDifference = (timestamp, missionStartDate) => {
    if (!timestamp || !missionStartDate) return 0;
    
    const recordTime = new Date(timestamp);
    const startTime = new Date(missionStartDate);
    
    return Math.floor((recordTime.getTime() - startTime.getTime()) / 1000);
  };

  const processAllMissionsData = (missionsWithData, colors) => {
    const sensorData = {
      timeLabels: [],
      temperature: { 
        series: [],
        min: Infinity,
        max: -Infinity,
        unit: "°C"
      },
      pressure: { 
        series: [],
        min: Infinity,
        max: -Infinity,
        unit: "hPa"
      },
      humidity: { 
        series: [],
        min: Infinity,
        max: -Infinity,
        unit: "%"
      },
      altitude: { 
        series: [],
        min: Infinity,
        max: -Infinity,
        unit: "m"
      },
      co2: { 
        series: [],
        min: Infinity,
        max: -Infinity,
        unit: "ppm"
      },
    };
    
    const trajectoryData = [];
    let maxTimePoints = 0;
    
    missionsWithData.forEach((mission, missionIndex) => {
      if (!mission.records || mission.records.length === 0) return;
      
      const missionColor = colors[missionIndex % colors.length];
      
      const tempData = [];
      const pressureData = [];
      const humidityData = [];
      const altitudeData = [];
      const co2Data = [];
      const trajectoryPoints = [];
      const timePoints = [];
      
      const missionStartDate = mission.start_date;
      
      mission.records.forEach((record, index) => {
        const data = record.data;
        
        if (data.timestamp && missionStartDate) {
          const timeDiff = calculateTimeDifference(data.timestamp, missionStartDate);
          timePoints.push(`${timeDiff}s`);
        }
        
        if (data.temperature_c !== undefined) {
          const tempValue = Number(data.temperature_c);
          if (!isNaN(tempValue) && isFinite(tempValue)) {
            tempData.push(tempValue);
            sensorData.temperature.min = Math.min(sensorData.temperature.min, tempValue);
            sensorData.temperature.max = Math.max(sensorData.temperature.max, tempValue);
          }
        }
        
        if (data.pressure_hpa !== undefined) {
          const pressureValue = Number(data.pressure_hpa);
          if (!isNaN(pressureValue) && isFinite(pressureValue)) {
            pressureData.push(pressureValue);
            sensorData.pressure.min = Math.min(sensorData.pressure.min, pressureValue);
            sensorData.pressure.max = Math.max(sensorData.pressure.max, pressureValue);
          }
        }
        
        if (data.humidity_percent !== undefined) {
          const humidityValue = Number(data.humidity_percent);
          if (!isNaN(humidityValue) && isFinite(humidityValue)) {
            humidityData.push(humidityValue);
            sensorData.humidity.min = Math.min(sensorData.humidity.min, humidityValue);
            sensorData.humidity.max = Math.max(sensorData.humidity.max, humidityValue);
          }
        }
        
        if (data.altitude_m !== undefined) {
          const altitudeValue = Number(data.altitude_m);
          if (!isNaN(altitudeValue) && isFinite(altitudeValue)) {
            altitudeData.push(altitudeValue);
            sensorData.altitude.min = Math.min(sensorData.altitude.min, altitudeValue);
            sensorData.altitude.max = Math.max(sensorData.altitude.max, altitudeValue);
          }
        }
        
        if (data.co2_ppm !== undefined) {
          const co2Value = Number(data.co2_ppm);
          if (!isNaN(co2Value) && isFinite(co2Value)) {
            co2Data.push(co2Value);
            sensorData.co2.min = Math.min(sensorData.co2.min, co2Value);
            sensorData.co2.max = Math.max(sensorData.co2.max, co2Value);
          }
        }
        
        if (data.latitude !== undefined && data.longitude !== undefined) {
          const latitude = Number(data.latitude);
          const longitude = Number(data.longitude);
          if (!isNaN(latitude) && !isNaN(longitude)) {
            trajectoryPoints.push([latitude, longitude]);
          }
        }
      });
      
      if (timePoints.length > maxTimePoints) {
        maxTimePoints = timePoints.length;
        sensorData.timeLabels = timePoints;
      }
      
      if (tempData.length > 0) {
        sensorData.temperature.series.push({
          name: mission.name,
          data: tempData,
          color: missionColor
        });
      }
      
      if (pressureData.length > 0) {
        sensorData.pressure.series.push({
          name: mission.name,
          data: pressureData,
          color: missionColor
        });
      }
      
      if (humidityData.length > 0) {
        sensorData.humidity.series.push({
          name: mission.name,
          data: humidityData,
          color: missionColor
        });
      }
      
      if (altitudeData.length > 0) {
        sensorData.altitude.series.push({
          name: mission.name,
          data: altitudeData,
          color: missionColor
        });
      }
      
      if (co2Data.length > 0) {
        sensorData.co2.series.push({
          name: mission.name,
          data: co2Data,
          color: missionColor
        });
      }
      
      if (trajectoryPoints.length > 0) {
        trajectoryData.push({
          name: mission.name,
          path: trajectoryPoints,
          color: missionColor
        });
      }
    });

    if (!isFinite(sensorData.temperature.min) || !isFinite(sensorData.temperature.max)) {
      sensorData.temperature.min = 0;
      sensorData.temperature.max = 30;
    }
    
    if (!isFinite(sensorData.pressure.min) || !isFinite(sensorData.pressure.max)) {
      sensorData.pressure.min = 900;
      sensorData.pressure.max = 1100;
    }
    
    if (!isFinite(sensorData.humidity.min) || !isFinite(sensorData.humidity.max)) {
      sensorData.humidity.min = 0;
      sensorData.humidity.max = 100;
    }
    
    if (!isFinite(sensorData.altitude.min) || !isFinite(sensorData.altitude.max)) {
      sensorData.altitude.min = 0;
      sensorData.altitude.max = 500;
    }
    
    if (!isFinite(sensorData.co2.min) || !isFinite(sensorData.co2.max)) {
      sensorData.co2.min = 300;
      sensorData.co2.max = 1500;
    }
    
    return { sensorData, trajectoryData };
  };

  const formatDuration = (duration) => {
	if (!duration) return 'Dados indisponíveis';
	
	try {
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="h1" variant="h4">
          Análise de Dados
        </Typography>
      </Box>
      
      {missions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Não existem missões concluídas.
        </Alert>
      ) : (
        <>
			<Typography component="h1" variant="h4" sx={{ mb: 2 }} fontWeight="medium">
				Missões Recentes
			</Typography>
			<Grid container spacing={2} sx={{ mb: 3 }}>
				{missions.map((mission, index) => {
				const startDate = new Date(mission.start_date);
				const endDate = new Date(mission.end_date);
				const sameDay = startDate.toLocaleDateString('pt-PT') === endDate.toLocaleDateString('pt-PT');
				
				return (
					<Grid size={{ xs: 12, sm: 4 }} key={mission.id}>
						<Box 
							sx={{ 
							p: 2, 
							borderRadius: 1,
							border: `1px solid ${missionColors[index % missionColors.length]}`,
							bgcolor: alpha(missionColors[index % missionColors.length], 0.1),
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between'
							}}
						>
							<Typography variant="subtitle1" fontWeight="bold">
								{mission.name}
							</Typography>
							<Box>
								<Typography variant="body2">
									Data: {sameDay ? 
									new Date(mission.start_date).toLocaleDateString('pt-PT', {
										day: 'numeric', month: 'long', year: 'numeric'
									}) :
									`${new Date(mission.start_date).toLocaleDateString('pt-PT', {
										day: 'numeric', month: 'long', year: 'numeric'
									})} - ${new Date(mission.end_date).toLocaleDateString('pt-PT', {
										day: 'numeric', month: 'long', year: 'numeric'
									})}`
									}
								</Typography>
								<Typography variant="body2">
									Hora: {new Date(mission.start_date).toLocaleTimeString('pt-PT', { 
									hour: '2-digit', minute: '2-digit', second: '2-digit'
									})} - {new Date(mission.end_date).toLocaleTimeString('pt-PT', {
									hour: '2-digit', minute: '2-digit', second: '2-digit'
									})}
								</Typography>
								<Typography variant="body2">
									Duração: {formatDuration(mission.duration)}
								</Typography>
								<Box 
									sx={{ 
									width: 16, 
									height: 16, 
									bgcolor: missionColors[index % missionColors.length],
									borderRadius: '50%',
									display: 'inline-block',
									ml: 1,
									mt: 1
									}} 
								/>
							</Box>
						</Box>
					</Grid>
				);
				})}
			</Grid>
          <Typography component="h1" variant="h4" sx={{ mb: 2 }} fontWeight="medium">
            Trajetórias
          </Typography>
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <Box sx={{ height: 500, position: 'relative' }}>
              <MapContainer 
                center={[41.0644, -8.5762]} 
                zoom={16} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {trajectoryData.map((trajectory, index) => (
                  <Polyline 
                    key={`trajectory-${index}`}
                    positions={trajectory.path} 
                    color={trajectory.color} 
                    weight={3} 
                    opacity={0.8}
                    smoothFactor={1}
                  >
                    <Popup>
                      {trajectory.name}
                    </Popup>
                  </Polyline>
                ))}
                {trajectoryData.map((trajectory, index) => (
                  trajectory.path.length > 0 && (
                    <Marker 
                      key={`endpoint-${index}`}
                      position={trajectory.path[trajectory.path.length - 1]}
                    >
                      <Popup>
                        Ponto final: {trajectory.name}
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </Box>
          </Card>
          
          <Typography component="h1" variant="h4" sx={{ mb: 2 }} fontWeight="medium">
            Visualização de Dados
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
              <MultiSensorChart 
                title="Temperatura"
                unit={sensorsData.temperature.unit}
                seriesData={sensorsData.temperature.series}
                timeLabels={sensorsData.timeLabels.length > 0 ? sensorsData.timeLabels : ['0s']}
                icon={<Thermostat color="error" />}
                minValue={sensorsData.temperature.min * 0.8}
                maxValue={sensorsData.temperature.max * 1.2}
              />
            </Grid>
            
            <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
              <MultiSensorChart 
                title="Pressão"
                unit={sensorsData.pressure.unit}
                seriesData={sensorsData.pressure.series}
                timeLabels={sensorsData.timeLabels.length > 0 ? sensorsData.timeLabels : ['0s']}
                icon={<Compress color="info" />}
                minValue={sensorsData.pressure.min * 0.95}
                maxValue={sensorsData.pressure.max * 1.05}
              />
            </Grid>
            
            <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
              <MultiSensorChart 
                title="Humidade"
                unit={sensorsData.humidity.unit}
                seriesData={sensorsData.humidity.series}
                timeLabels={sensorsData.timeLabels.length > 0 ? sensorsData.timeLabels : ['0s']}
                icon={<Waves color="primary" />}
                minValue={0}
                maxValue={100}
              />
            </Grid>
            
            <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
              <MultiSensorChart 
                title="Altitude"
                unit={sensorsData.altitude.unit}
                seriesData={sensorsData.altitude.series}
                timeLabels={sensorsData.timeLabels.length > 0 ? sensorsData.timeLabels : ['0s']}
                icon={<Height color="secondary" />}
                minValue={0}
                maxValue={sensorsData.altitude.max * 1.2}
              />
            </Grid>
            
            <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
              <MultiSensorChart 
                title="Níveis de CO₂"
                unit={sensorsData.co2.unit}
                seriesData={sensorsData.co2.series}
                timeLabels={sensorsData.timeLabels.length > 0 ? sensorsData.timeLabels : ['0s']}
                icon={<Co2 color="warning" />}
                minValue={sensorsData.co2.min > 0 ? sensorsData.co2.min * 0.9 : 300}
                maxValue={sensorsData.co2.max * 1.1}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}