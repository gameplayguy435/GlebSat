import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { styled } from '@mui/material/styles';

export interface MultiSeriesData {
  name: string;
  data: number[];
  color: string;
}

export interface MultiSensorChartProps {
  title: string;
  unit: string;
  seriesData: MultiSeriesData[];
  timeLabels: string[];
  icon?: React.ReactNode;
  minValue?: number;
  maxValue?: number;
}

const SensorCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function MultiSensorChart({
  title,
  unit,
  seriesData,
  timeLabels,
  icon,
  minValue,
  maxValue,
}: MultiSensorChartProps) {
  const allValues = seriesData.flatMap(series => series.data);
  const min = minValue !== undefined ? minValue : 
    (allValues.length > 0 ? Math.min(...allValues) * 0.9 : 0);
  const max = maxValue !== undefined ? maxValue : 
    (allValues.length > 0 ? Math.max(...allValues) * 1.1 : 100);
  
  const gradientIds = seriesData.map(series => 
    `${title.toLowerCase().replace(/\s+/g, '-')}-${series.name.toLowerCase().replace(/\s+/g, '-')}-gradient-${Math.random().toString(36).substring(2, 9)}`
  );
  
  const formatTimeLabel = (label: string) => {
    const seconds = parseInt(label.replace('s', ''));
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      if (minutes === 0 && secs === 0) return `${hours}h`;
      if (secs === 0) return `${hours}h ${minutes}m`;
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (secs === 0) return `${minutes}m`;
      return `${minutes}m ${secs}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getTickInterval = () => {
    if (timeLabels.length === 0) return 30;
    
    const allSeconds = timeLabels.map(label => parseInt(label.replace('s', '')));
    const maxSeconds = Math.max(...allSeconds);
    
    if (maxSeconds <= 60) return 10;
    if (maxSeconds <= 300) return 30;
    return 60;
  };

  const tickIntervalSeconds = getTickInterval();

  const getCustomTicks = () => {
    if (timeLabels.length === 0) return [];
    
    const allSeconds = timeLabels.map(label => parseInt(label.replace('s', '')));
    const maxSeconds = Math.max(...allSeconds);
    const minSeconds = Math.min(...allSeconds);
    
    const ticks = [];
    for (let i = minSeconds; i <= maxSeconds; i += tickIntervalSeconds) {
      const closestIndex = timeLabels.findIndex(label => {
        const seconds = parseInt(label.replace('s', ''));
        return Math.abs(seconds - i) <= tickIntervalSeconds / 2;
      });
      
      if (closestIndex !== -1) {
        ticks.push(closestIndex);
      }
    }
    
    const lastIndex = timeLabels.length - 1;
    if (lastIndex > 0 && !ticks.includes(lastIndex)) {
      ticks.push(lastIndex);
    }
    
    return ticks;
  };

  const customTickIndices = getCustomTicks();

  return (
    <SensorCard variant="outlined">
      <Box>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        
        <Box sx={{ height: 170, mt: 2 }}>
          <LineChart
            xAxis={[{
              data: timeLabels,
              scaleType: 'point',
              tickInterval: (_, i) => customTickIndices.includes(i),
              valueFormatter: formatTimeLabel
            }]}
            yAxis={[{
              min: min,
              max: max,
              tickNumber: 4,
            }]}
            series={
              seriesData.map((series, index) => ({
                data: series.data,
                showMark: false,
                color: series.color,
                id: `${title.toLowerCase().replace(/\s+/g, '-')}-${series.name.toLowerCase().replace(/\s+/g, '-')}`,
                label: series.name
              }))
            }
            height={170}
            margin={{ left: 40, right: 20, top: 10, bottom: 30 }}
            grid={{ 
              horizontal: true,
              vertical: false 
            }}
            slotProps={{
                legend: {
                  hidden: true
                }
              }}
            sx={{
              ...seriesData.reduce((acc, series, index) => {
                const seriesId = `${title.toLowerCase().replace(/\s+/g, '-')}-${series.name.toLowerCase().replace(/\s+/g, '-')}`;
                return {
                  ...acc,
                  [`& .MuiAreaElement-series-${seriesId}`]: {
                    fill: `url('#${gradientIds[index]}')`,
                  }
                };
              }, {})
            }}
          >
            {seriesData.map((series, index) => (
              <AreaGradient 
                key={index} 
                color={series.color} 
                id={gradientIds[index]} 
              />
            ))}
          </LineChart>
        </Box>
      </Box>
    </SensorCard>
  );
}