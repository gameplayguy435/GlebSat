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
  // Calculate min/max across all series
  const allValues = seriesData.flatMap(series => series.data);
  const min = minValue !== undefined ? minValue : 
    (allValues.length > 0 ? Math.min(...allValues) * 0.9 : 0);
  const max = maxValue !== undefined ? maxValue : 
    (allValues.length > 0 ? Math.max(...allValues) * 1.1 : 100);
  
  // Generate unique gradient IDs for each series
  const gradientIds = seriesData.map(series => 
    `${title.toLowerCase().replace(/\s+/g, '-')}-${series.name.toLowerCase().replace(/\s+/g, '-')}-gradient-${Math.random().toString(36).substring(2, 9)}`
  );
  
  const formatTimeLabel = (label: string) => {
    const seconds = parseInt(label.replace('s', '')) + 1;
    if (seconds % 60 === 0) {
      return `${Math.floor(seconds / 60)}m`;
    }
    if (seconds < 60) {
      return `${seconds}s`;
    }
    else {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}m ${sec}s`;
    }
  };

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
              scaleType: 'band',
              tickInterval: (_, i) => (i + 1) % 30 === 0,
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
            margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
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