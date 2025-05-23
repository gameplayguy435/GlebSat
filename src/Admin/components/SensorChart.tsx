import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { styled } from '@mui/material/styles';

export interface SensorChartProps {
  title: string;
  value: string;
  unit: string;
  interval?: string;
  trend: 'up' | 'down' | 'neutral';
  trendLabel: string;
  data: number[];
  timeLabels: string[];
  color: string;
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

const StyledChip = styled(Chip)(({ theme, color = 'default' }) => {
  const colors = {
    success: {
      bgcolor: theme.palette.success.light + '20',
      borderColor: theme.palette.success.main,
      color: theme.palette.success.main,
    },
    error: {
      bgcolor: theme.palette.error.light + '20',
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
    warning: {
      bgcolor: theme.palette.warning.light + '20', 
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(176, 177, 180, 0.8)'
        : 'rgba(107, 114, 128, 0.4)',
      color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.9)'
        : 'rgba(0, 0, 0, 0.9)',
    },
    default: {
      bgcolor: theme.palette.action.hover,
      borderColor: theme.palette.divider,
      color: theme.palette.text.secondary,
    },
  };
  
  return {
    height: '24px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.8rem',
    backgroundColor: colors[color].bgcolor,
    border: `1px solid ${colors[color].borderColor}`,
    color: colors[color].color,
    '&:hover': {
      backgroundColor: colors[color].bgcolor,
    },
  };
});

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

export default function SensorChart({
  title,
  value,
  unit,
  interval = 'Atualizado a cada segundo da missão',
  trend,
  trendLabel,
  data,
  timeLabels,
  color,
  icon,
  minValue,
  maxValue,
}: SensorChartProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return title === 'Níveis de CO₂' || title === 'Partículas Finas' ? 'error' : 'success';
      case 'down':
        return title === 'Níveis de CO₂' || title === 'Partículas Finas' ? 'success' : 'warning';
      default:
        return 'default';
    }
  };

  const min = minValue !== undefined ? minValue : Math.min(...data) * 0.9;
  const max = maxValue !== undefined ? maxValue : Math.max(...data) * 1.1;
  
  const gradientId = `${title.toLowerCase().replace(/\s+/g, '-')}-gradient-${Math.random().toString(36).substring(2, 9)}`;
  
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
      <Stack sx={{ justifyContent: 'space-between', height: '100%' }}>
        <Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
          
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="h4" component="p">
              {value}{unit}
            </Typography>
            <StyledChip 
              size="small" 
              color={getTrendColor() as any}
              label={trendLabel} 
            />
          </Stack>
          
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {interval}
          </Typography>
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
            series={[
              {
                data: data,
                area: true,
                showMark: false,
                color: color,
                id: title.toLowerCase().replace(/\s+/g, '-'),
              }
            ]}
            height={170}
            margin={{ left: 40, right: 20, top: 10, bottom: 30 }}
            grid={{ 
              horizontal: true,
              vertical: false 
            }}
            sx={{
              [`& .MuiAreaElement-series-${title.toLowerCase().replace(/\s+/g, '-')}`]: {
                fill: `url('#${gradientId}')`,
              }
            }}
          >
            <AreaGradient color={color} id={gradientId} />
          </LineChart>
        </Box>
      </Stack>
    </SensorCard>
  );
}