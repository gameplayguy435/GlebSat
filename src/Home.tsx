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

  return (
    <div>
      {/* Video/Countdown Section */}
      <div className="relative h-96">
        {isStreaming ? (
          <div className="h-full w-full flex items-center justify-center" data-aos="fade-up">
            <Video className="w-16 h-16 text-blue-400" />
            <span className="ml-2 text-xl">Live Stream Starting Soon...</span>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4" data-aos="fade-up">
            <Clock className="w-16 h-16 text-blue-400 animate-pulse" />
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Next Transmission</h2>
              <div className="text-4xl font-mono">12:34:56</div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div data-aos="fade-up">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl transition-all bg-secondary shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">Air Quality Index</h3>
            <div className="text-4xl font-bold text-green-400">45 AQI</div>
            <div className="mt-2 text-sm">Good - Updated 2 mins ago</div>
          </motion.div>
        </div>

        <div data-aos="fade-up">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl transition-all bg-secondary shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">Temperature</h3>
            <div className="text-4xl font-bold text-blue-400">22°C</div>
            <div className="mt-2 text-sm">Surface Level - ±0.5°C accuracy</div>
          </motion.div>
        </div>

        <div data-aos="fade-up">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl transition-all bg-secondary shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">CO² Levels</h3>
            <div className="text-4xl font-bold text-purple-400">412ppm</div>
            <div className="mt-2 text-sm">Stable - 0.8% increase</div>
          </motion.div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="p-6 rounded-xl bg-secondary shadow-xl" data-aos="fade-up">
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
      </div>


      {/* Page Previews */}
      <div className="max-w-7xl mx-auto px-4 pb-12 grid md:grid-cols-3 gap-8">
        {['Documentation', 'News', 'Gallery'].map((page) => (
          <div key={page} data-aos="fade-up">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl cursor-pointer bg-secondary shadow-xl hover:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">{page}</h3>
              <p className="mb-4">
                {page === 'Documentation' && 'Technical specifications and mission details'}
                {page === 'News' && 'Latest updates and mission progress'}
                {page === 'Gallery' && 'Visual journey through our mission'}
              </p>
              <div className="flex items-center text-blue-400">
                <ArrowRight className="mr-2" />
                <span>Explore {page}</span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;