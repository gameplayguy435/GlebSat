export type TimeLabel = string;
export type SensorReading = number;

export interface SensorData {
  timeLabels: TimeLabel[];
  temperature: {
    current: string;
    unit: string;
    min: number;
    max: number;
    series: SensorReading[];
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
  };
  pressure: {
    current: string;
    unit: string;
    min: number;
    max: number;
    series: SensorReading[];
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
  };
  humidity: {
    current: string;
    unit: string;
    min: number;
    max: number;
    series: SensorReading[];
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
  };
  altitude: {
    current: string;
    unit: string;
    min: number;
    max: number;
    series: SensorReading[];
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
  };
  co2: {
    current: string;
    unit: string;
    min: number;
    max: number;
    series: SensorReading[];
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
  };
  particles: {
    current: string;
    unit: string;
    min: number;
    max: number;
    series: SensorReading[];
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
  };
}

const DATA_POINTS = 300;

export const generateTimeLabels = (): TimeLabel[] => {
  return Array.from({ length: DATA_POINTS }, (_, i) => `${i}s`);
};

const generateSmoothData = (start: number, end: number, amplitude: number = 0.5, spikeChance = 0): SensorReading[] => {
  const result: SensorReading[] = [];
  const totalPoints = DATA_POINTS;
  
  for (let i = 0; i < totalPoints; i++) {
    const position = i / (totalPoints - 1);
    const baseValue = start + (end - start) * (Math.pow(position, 1.2));
    
    const oscillation = Math.sin(i * 0.05) * amplitude * (1 + Math.random() * 0.3);
    
    const noise = (Math.random() * 2 - 1) * amplitude * 0.3;
    
    let value = baseValue + oscillation + noise;
    
    if (spikeChance > 0 && Math.random() < spikeChance) {
      const spikeIntensity = (Math.random() * 2 + 1) * amplitude * 4;
      const spikeDuration = Math.floor(Math.random() * 8) + 3;
      
      for (let j = 0; j < spikeDuration && i + j < totalPoints; j++) {
        const spikePosition = j / spikeDuration;
        const spikeEffect = spikeIntensity * Math.exp(-10 * Math.pow(spikePosition - 0.5, 2));
        
        if (i + j < totalPoints) {
          if (j === 0) {
            value += spikeEffect;
          } else {
            result[i + j] = baseValue + oscillation + noise + spikeEffect;
          }
        }
      }
      
      i += spikeDuration - 1;
    }
    
    if (!result[i]) {
      result.push(value);
    }
  }
  
  for (let i = 0; i < totalPoints; i++) {
    if (result[i] === undefined) {
      const prevValue = result[i-1] || start;
      const nextValue = result.find((v, idx) => idx > i && v !== undefined) || end;
      result[i] = prevValue + (nextValue - prevValue) * 0.5;
    }
  }
  
  return result;
};

const temperatureData: SensorReading[] = generateSmoothData(19.5, 22.5, 0.3);
const pressureData: SensorReading[] = generateSmoothData(1013, 1005, 0.2);
const humidityData: SensorReading[] = generateSmoothData(45, 54, 2, 0.01);
const altitudeData: SensorReading[] = generateSmoothData(180, 440, 5);
const co2Data: SensorReading[] = generateSmoothData(402, 460, 1);
const particlesData: SensorReading[] = generateSmoothData(20.5, 24, 1.5, 0.03);

const calculateTrend = (data: number[]): { trend: 'up' | 'down' | 'neutral'; trendLabel: string } => {
  const first = data[0];
  const last = data[data.length - 1];
  const percentChange = ((last - first) / first) * 100;
  
  if (percentChange > 3) {
    return { trend: 'up', trendLabel: `+${percentChange.toFixed(1)}%` };
  } else if (percentChange < -3) {
    return { trend: 'down', trendLabel: `${percentChange.toFixed(1)}%` };
  } else {
    return { trend: 'neutral', trendLabel: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%` };
  }
};

export const demoSensorData: SensorData = {
  timeLabels: generateTimeLabels(),
  temperature: {
    current: temperatureData[temperatureData.length - 1].toFixed(1),
    unit: "°C",
    min: 17,
    max: 25,
    series: temperatureData,
    ...calculateTrend(temperatureData)
  },
  pressure: {
    current: pressureData[pressureData.length - 1].toFixed(1),
    unit: "hPa",
    min: 990,
    max: 1030,
    series: pressureData,
    ...calculateTrend(pressureData)
  },
  humidity: {
    current: humidityData[humidityData.length - 1].toFixed(0),
    unit: "%",
    min: 30,
    max: 80,
    series: humidityData,
    ...calculateTrend(humidityData)
  },
  altitude: {
    current: altitudeData[altitudeData.length - 1].toFixed(0),
    unit: "m",
    min: 50,
    max: 400,
    series: altitudeData,
    ...calculateTrend(altitudeData)
  },
  co2: {
    current: co2Data[co2Data.length - 1].toFixed(0),
    unit: "ppm",
    min: 250,
    max: 470,
    series: co2Data,
    ...calculateTrend(co2Data)
  },
  particles: {
    current: particlesData[particlesData.length - 1].toFixed(1),
    unit: "µg/m³",
    min: 15,
    max: 40,
    series: particlesData,
    ...calculateTrend(particlesData)
  }
};

export const demoTrajectoryData = (() => {
  const center = [41.0644, -8.5762];
  const radius = 0.002;
  const points = 30;
  const trajectory = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2; 
    const noise = Math.random() * 0.0003;
    const lat = center[0] + Math.cos(angle) * radius + noise;
    const lng = center[1] + Math.sin(angle) * radius + noise;
    
    trajectory.push([lat, lng]);
  }
  
  return trajectory;
})();

export const demoMissionData = {
  id: 1,
  name: "Missão Estratosférica Alpha",
  start_date: new Date().toISOString(),
  end_date: null,
  duration: null
};