import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { styled } from '@mui/material/styles';

// Custom props interface matching the original SensorChart
export interface FrontSensorChartProps {
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

// Hardcoded styled components to match admin theme
const FrontSensorCard = styled(Card)({
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--background-primary, #fff)',
  border: '1px solid var(--border-primary, #e0e0e0)',
  '& .MuiTypography-h4': {
    fontSize: '2rem',
    fontWeight: 500,
    color: 'var(--text-primary, #000)',
  },
  '& .MuiTypography-h6': {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: 'var(--text-primary, #000)',
  },
  '& .MuiTypography-caption': {
    fontSize: '0.75rem',
    color: 'var(--text-secondary, rgba(0, 0, 0, 0.6))',
  },
});

// Chart gradient definition
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

// Custom Chip with hardcoded styling to match admin theme
const StyledChip = styled(Chip)(({ color = 'default' }) => {
  const colors = {
    success: {
      bgcolor: 'rgba(46, 125, 50, 0.1)',
      borderColor: 'rgba(46, 125, 50, 0.5)',
      color: '#4caf50',
    },
    error: {
      bgcolor: 'rgba(211, 47, 47, 0.1)',
      borderColor: 'rgba(211, 47, 47, 0.5)',
      color: '#f44336',
    },
    warning: {
      bgcolor: 'rgba(237, 108, 2, 0.1)',
      borderColor: 'rgba(237, 108, 2, 0.5)',
      color: '#ff9800',
    },
    default: {
      bgcolor: 'rgba(100, 100, 100, 0.25)',
      borderColor: 'var(--border-main, #fff)',
      color: 'var(--text-secondary, rgba(0, 0, 0, 0.87))',
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
  };
});

export default function FrontSensorChart({
  title,
  value,
  unit,
  interval = 'Dados registados ao segundo',
  trend,
  trendLabel,
  data,
  timeLabels,
  color,
  icon,
  minValue,
  maxValue,
}: FrontSensorChartProps) {
  
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
    <FrontSensorCard>
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
              color={getTrendColor()}
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
              scaleType: 'band',
              tickInterval: (_, i) => (i + 1) % 30 === 0,
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
            margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
            grid={{ 
              horizontal: true,
              vertical: false 
            }}
            sx={{
              '& .MuiChartsAxis-tickLabel': {
                fontSize: '0.75rem',
                fill: 'var(--text-secondary, rgba(0, 0, 0, 0.6))',
              },
              '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
                stroke: 'var(--text-secondary, rgba(0, 0, 0, 0.1))',
              },
              '& .MuiChartsGrid-line': {
                stroke: 'var(--text-secondary, rgba(0, 0, 0, 0.1))',
                strokeDasharray: '4 2',
                opacity: 0.3,
              },
              [`& .MuiAreaElement-series-${title.toLowerCase().replace(/\s+/g, '-')}`]: {
                fill: `url('#${gradientId}')`,
              }
            }}
          >
            <AreaGradient color={color} id={gradientId} />
          </LineChart>
        </Box>
      </Stack>
    </FrontSensorCard>
  );
}