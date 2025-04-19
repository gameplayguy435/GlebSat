import { useState, useEffect } from 'react';
import { 
	alpha,
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Divider,
	Grid2 as Grid,
	Typography,
	useTheme,
} from '@mui/material';
import { 
	Air,
	Analytics,
	Co2,
	Compress,
	Dashboard,
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
import { 
	CartesianGrid, 
	Legend,
	Line,
	LineChart,
	ResponsiveContainer, 
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const AnalysisCard = styled(Card)(({ theme }) => ({
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

export default function DataAnalysis() {
	const theme = useTheme();
	const [loading, setLoading] = useState(true);
	const [missions, setMissions] = useState([]);
	const [error, setError] = useState(null);
	const [sensorsData, setSensorsData] = useState(null);
	const [trajectoryData, setTrajectoryData] = useState([]);
	
	// Define mission colors - using distinct colors for better visualization
	const missionColors = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.error.main
	];

	useEffect(() => {
		fixLeafletIcon();
	}, []);

	// Fetch the last 3 completed missions
	useEffect(() => {
		const fetchMissionsData = async () => {
			setLoading(true);
			try {
				// 1. Fetch all missions
				const missionsResponse = await fetch(`${API_URL}/mission`);
				const missionsData = await missionsResponse.json();
				
				if (missionsData.success) {
					// 2. Filter completed missions (with end_date)
					const completedMissions = missionsData.missions
						.filter(mission => mission.end_date)
						.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())
						.slice(0, 3); // Take the 3 most recent
						
					setMissions(completedMissions);
					
					// 3. For each mission, fetch its records
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
					
					// 4. Process all missions data
					const processedData = processMultipleMissionsData(missionsWithData, missionColors);
					setSensorsData(processedData.sensorsData);
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

	// Function to process data from multiple missions
	const processMultipleMissionsData = (missionsWithData, colors) => {
		// Initialize data structure for each sensor type
		const sensorsData = {
			timeLabels: [],
			temperature: { series: [], colors: [] },
			pressure: { series: [], colors: [] },
			humidity: { series: [], colors: [] },
			altitude: { series: [], colors: [] },
			co2: { series: [], colors: [] },
			particles: { series: [], colors: [] }
		};
		
		// Initialize trajectory data for the map
		const trajectoryData = [];
		
		// Process each mission
		missionsWithData.forEach((mission, index) => {
			if (!mission.records || mission.records.length === 0) return;
			
			const color = colors[index % colors.length];
			
			// Process records for this mission
			const missionData = processMissionData(mission.records);
			
			// Add this mission data to the overall data structure
			sensorsData.temperature.series.push({
				name: mission.name,
				data: missionData.temperature.series,
				color
			});
			
			sensorsData.pressure.series.push({
				name: mission.name,
				data: missionData.pressure.series,
				color
			});
			
			sensorsData.humidity.series.push({
				name: mission.name,
				data: missionData.humidity.series,
				color
			});
			
			sensorsData.altitude.series.push({
				name: mission.name,
				data: missionData.altitude.series,
				color
			});
			
			sensorsData.co2.series.push({
				name: mission.name,
				data: missionData.co2.series,
				color
			});
			
			sensorsData.particles.series.push({
				name: mission.name,
				data: missionData.particles.series,
				color
			});
			
			// Add trajectory data
			if (missionData.trajectoryData && missionData.trajectoryData.length > 0) {
				trajectoryData.push({
					name: mission.name,
					path: missionData.trajectoryData,
					color
				});
			}
			
			// Ensure we have time labels that encompass all missions
			if (missionData.timeLabels.length > sensorsData.timeLabels.length) {
				sensorsData.timeLabels = missionData.timeLabels;
			}
		});
		
		return { sensorsData, trajectoryData };
	};
	
	// Process raw data from a single mission - similar to ViewMissions
	const processMissionData = (records) => {
		const temperature = { series: [] };
		const pressure = { series: [] };
		const humidity = { series: [] };
		const altitude = { series: [] };
		const co2 = { series: [] };
		const particles = { series: [] };
		
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
			
			// Process each sensor reading
			if (data.temperature_c !== undefined) {
				const tempValue = Number(data.temperature_c);
				if (!isNaN(tempValue)) {
					temperature.series.push(tempValue);
				}
			}
			
			if (data.pressure_hpa !== undefined) {
				const pressureValue = Number(data.pressure_hpa);
				if (!isNaN(pressureValue)) {
					pressure.series.push(pressureValue);
				}
			}
			
			if (data.humidity_percent !== undefined) {
				const humidityValue = Number(data.humidity_percent);
				if (!isNaN(humidityValue)) {
					humidity.series.push(humidityValue);
				}
			}
			
			if (data.altitude_m !== undefined) {
				const altitudeValue = Number(data.altitude_m);
				if (!isNaN(altitudeValue)) {
					altitude.series.push(altitudeValue);
				}
			}
			
			if (data.co2_ppm !== undefined) {
				const co2Value = Number(data.co2_ppm);
				if (!isNaN(co2Value)) {
					co2.series.push(co2Value);
				}
			}
			
			if (data.particles_ug_m3 !== undefined) {
				const particlesValue = Number(data.particles_ug_m3);
				if (!isNaN(particlesValue)) {
					particles.series.push(particlesValue);
				}
			}
			
			// Extract trajectory coordinates
			if (data.latitude !== undefined && data.longitude !== undefined) {
				const latitude = Number(data.latitude);
				const longitude = Number(data.longitude);
				if (!isNaN(latitude) && !isNaN(longitude)) {
					trajectoryData.push([latitude, longitude]);
				}
			}
		});
		
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

	// Format multi-series data for charts
	const formatChartData = (seriesData, timeLabels) => {
		if (!seriesData || !seriesData.series || seriesData.series.length === 0) return [];
		
		// Create data points with all series values at each time point
		return timeLabels.map((label, index) => {
			const dataPoint = { name: label };
			
			seriesData.series.forEach(series => {
				if (series.data && series.data[index] !== undefined) {
					dataPoint[series.name] = series.data[index];
				}
			});
			
			return dataPoint;
		});
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
				<Typography component="h1" variant="h4" fontWeight="medium">
					Análise Comparativa de Missões
				</Typography>
			</Box>
			
			{missions.length === 0 ? (
				<Alert severity="info" sx={{ mt: 2 }}>
					Não existem missões concluídas para analisar.
				</Alert>
			) : (
				<>
					<Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
						<Typography variant="h6" gutterBottom>
							Missões em Análise
						</Typography>
						<Grid container spacing={2}>
							{missions.map((mission, index) => (
								<Grid xs={12} md={4} key={mission.id}>
									<Box 
										sx={{ 
											p: 2, 
											borderRadius: 1,
											border: `1px solid ${missionColors[index % missionColors.length]}`,
											bgcolor: alpha(missionColors[index % missionColors.length], 0.1)
										}}
									>
										<Typography variant="subtitle1" fontWeight="bold">
											{mission.name}
										</Typography>
										<Typography variant="body2">
											ID: {mission.id}
										</Typography>
										<Typography variant="body2">
											Data: {new Date(mission.start_date).toLocaleDateString('pt-PT')}
										</Typography>
										<Box 
											sx={{ 
												width: 16, 
												height: 16, 
												bgcolor: missionColors[index % missionColors.length],
												borderRadius: '50%',
												display: 'inline-block',
												ml: 1
											}} 
										/>
									</Box>
								</Grid>
							))}
						</Grid>
					</Card>
					
					<Card sx={{ mb: 3, borderRadius: 2 }}>
						<Box sx={{ p: 2 }}>
							<Typography variant="h6">
								Trajetórias Comparativas
							</Typography>
						</Box>
						<Divider />
						<Box sx={{ height: 500, position: 'relative' }}>
							<MapContainer 
								center={[41.0644, -8.5762]} 
								zoom={13} 
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
					
					<Typography component="h2" variant="h5" sx={{ mb: 2 }}>
						Análise de Sensores
					</Typography>
					
					<Grid container spacing={3} sx={{ mb: 3 }}>
						<Grid xs={12} lg={6}>
							<AnalysisCard>
								<Box sx={{ p: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
										<Thermostat color="error" />
										<Typography variant="h6">
											Temperatura (°C)
										</Typography>
									</Box>
									<Box sx={{ height: 300 }}>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={formatChartData(sensorsData?.temperature, sensorsData?.timeLabels)}
												margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Legend />
												{sensorsData?.temperature.series.map((series, index) => (
													<Line
														key={`temp-${index}`}
														type="monotone"
														dataKey={series.name}
														stroke={series.color}
														dot={false}
														activeDot={{ r: 4 }}
													/>
												))}
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</Box>
							</AnalysisCard>
						</Grid>
						
						<Grid xs={12} lg={6}>
							<AnalysisCard>
								<Box sx={{ p: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
										<Compress color="info" />
										<Typography variant="h6">
											Pressão (hPa)
										</Typography>
									</Box>
									<Box sx={{ height: 300 }}>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={formatChartData(sensorsData?.pressure, sensorsData?.timeLabels)}
												margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Legend />
												{sensorsData?.pressure.series.map((series, index) => (
													<Line
														key={`press-${index}`}
														type="monotone"
														dataKey={series.name}
														stroke={series.color}
														dot={false}
														activeDot={{ r: 4 }}
													/>
												))}
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</Box>
							</AnalysisCard>
						</Grid>
						
						<Grid xs={12} lg={6}>
							<AnalysisCard>
								<Box sx={{ p: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
										<Waves color="primary" />
										<Typography variant="h6">
											Humidade (%)
										</Typography>
									</Box>
									<Box sx={{ height: 300 }}>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={formatChartData(sensorsData?.humidity, sensorsData?.timeLabels)}
												margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Legend />
												{sensorsData?.humidity.series.map((series, index) => (
													<Line
														key={`humid-${index}`}
														type="monotone"
														dataKey={series.name}
														stroke={series.color}
														dot={false}
														activeDot={{ r: 4 }}
													/>
												))}
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</Box>
							</AnalysisCard>
						</Grid>
						
						<Grid xs={12} lg={6}>
							<AnalysisCard>
								<Box sx={{ p: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
										<Height color="secondary" />
										<Typography variant="h6">
											Altitude (m)
										</Typography>
									</Box>
									<Box sx={{ height: 300 }}>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={formatChartData(sensorsData?.altitude, sensorsData?.timeLabels)}
												margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Legend />
												{sensorsData?.altitude.series.map((series, index) => (
													<Line
														key={`alt-${index}`}
														type="monotone"
														dataKey={series.name}
														stroke={series.color}
														dot={false}
														activeDot={{ r: 4 }}
													/>
												))}
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</Box>
							</AnalysisCard>
						</Grid>
						
						<Grid xs={12} lg={6}>
							<AnalysisCard>
								<Box sx={{ p: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
										<Co2 color="warning" />
										<Typography variant="h6">
											Níveis de CO₂ (ppm)
										</Typography>
									</Box>
									<Box sx={{ height: 300 }}>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={formatChartData(sensorsData?.co2, sensorsData?.timeLabels)}
												margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Legend />
												{sensorsData?.co2.series.map((series, index) => (
													<Line
														key={`co2-${index}`}
														type="monotone"
														dataKey={series.name}
														stroke={series.color}
														dot={false}
														activeDot={{ r: 4 }}
													/>
												))}
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</Box>
							</AnalysisCard>
						</Grid>
						
						<Grid xs={12} lg={6}>
							<AnalysisCard>
								<Box sx={{ p: 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
										<Air color="success" />
										<Typography variant="h6">
											Partículas Finas (µg/m³)
										</Typography>
									</Box>
									<Box sx={{ height: 300 }}>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart
												data={formatChartData(sensorsData?.particles, sensorsData?.timeLabels)}
												margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Legend />
												{sensorsData?.particles.series.map((series, index) => (
													<Line
														key={`part-${index}`}
														type="monotone"
														dataKey={series.name}
														stroke={series.color}
														dot={false}
														activeDot={{ r: 4 }}
													/>
												))}
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</Box>
							</AnalysisCard>
						</Grid>
					</Grid>
				</>
			)}
		</Box>
	);
}