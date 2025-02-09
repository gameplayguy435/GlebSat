import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Video, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  // Sample data and state
  const [isStreaming, setIsStreaming] = React.useState(false);
  const data = [
    { time: '00:00', aqi: 45, temp: 22 },
    { time: '04:00', aqi: 48, temp: 21 },
    { time: '08:00', aqi: 52, temp: 23 },
    { time: '12:00', aqi: 55, temp: 25 },
    { time: '16:00', aqi: 49, temp: 24 },
    { time: '20:00', aqi: 47, temp: 22 },
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Video/Countdown Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative h-96 bg-slate-800"
      >
        {isStreaming ? (
          <div className="h-full w-full bg-slate-700 flex items-center justify-center">
            <Video className="w-16 h-16 text-blue-400" />
            <span className="ml-2 text-xl">Live Stream Starting Soon...</span>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Clock className="w-16 h-16 text-blue-400 animate-pulse" />
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Next Transmission</h2>
              <div className="text-4xl font-mono">12:34:56</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <motion.div 
          variants={fadeIn}
          className="bg-slate-700 p-6 rounded-xl transition-all hover:scale-105"
        >
          <h3 className="text-xl font-bold mb-4">Air Quality Index</h3>
          <div className="text-4xl font-bold text-green-400">45 AQI</div>
          <div className="mt-2 text-sm text-slate-300">Good - Updated 2 mins ago</div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          className="bg-slate-700 p-6 rounded-xl transition-all hover:scale-105"
        >
          <h3 className="text-xl font-bold mb-4">Temperature</h3>
          <div className="text-4xl font-bold text-blue-400">22°C</div>
          <div className="mt-2 text-sm text-slate-300">Surface Level - ±0.5°C accuracy</div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          className="bg-slate-700 p-6 rounded-xl transition-all hover:scale-105"
        >
          <h3 className="text-xl font-bold mb-4">CO² Levels</h3>
          <div className="text-4xl font-bold text-purple-400">412ppm</div>
          <div className="mt-2 text-sm text-slate-300">Stable - 0.8% increase</div>
        </motion.div>
      </div>

      {/* Analytics Chart */}
      <motion.div 
        variants={fadeIn}
        className="max-w-7xl mx-auto px-4 pb-12"
      >
        <div className="bg-slate-700 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-6">24-Hour Trend Analysis</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="aqi" stroke="#8884d8" name="Air Quality Index" />
                <Line type="monotone" dataKey="temp" stroke="#82ca9d" name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>


      {/* Page Previews */}
      <div className="max-w-7xl mx-auto px-4 pb-12 grid md:grid-cols-3 gap-8">
        {['Documentation', 'News', 'Gallery'].map((page) => (
          <motion.div
            key={page}
            whileHover={{ y: -5 }}
            className="bg-slate-700 p-6 rounded-xl cursor-pointer"
          >
            <h3 className="text-xl font-bold mb-4">{page}</h3>
            <p className="text-slate-300 mb-4">
              {page === 'Documentation' && 'Technical specifications and mission details'}
              {page === 'News' && 'Latest updates and mission progress'}
              {page === 'Gallery' && 'Visual journey through our mission'}
            </p>
            <div className="flex items-center text-blue-400">
              <ArrowRight className="mr-2" />
              <span>Explore {page}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;