import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  // Sample data for the graph
  const data = [
    { time: '00:00', aqi: 45, temp: 22 },
    { time: '04:00', aqi: 48, temp: 21 },
    { time: '08:00', aqi: 52, temp: 23 },
    { time: '12:00', aqi: 55, temp: 25 },
    { time: '16:00', aqi: 49, temp: 24 },
    { time: '20:00', aqi: 47, temp: 22 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            GlebSat Environmental Monitoring
          </h1>
          <p className="text-xl mb-8">
            Real-time atmospheric data collection and analysis for a better understanding of our environment
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
            View Live Data
          </button>
        </div>
      </div>

      {/* Real-time Data Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Live Satellite Data</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <div className="h-[400px]">
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

        {/* Quick Links Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-4">Latest Documentation</h3>
            <p className="text-gray-600 mb-4">
              Access technical specifications and project methodology
            </p>
            <a href="/documentation" className="text-blue-600 flex items-center">
              Learn More <ArrowRight className="ml-2" size={16} />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-4">Recent Updates</h3>
            <p className="text-gray-600 mb-4">
              Stay informed about our latest developments and findings
            </p>
            <a href="/news" className="text-blue-600 flex items-center">
              View Updates <ArrowRight className="ml-2" size={16} />
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-4">Image Gallery</h3>
            <p className="text-gray-600 mb-4">
              Explore our visual documentation and mission images
            </p>
            <a href="/gallery" className="text-blue-600 flex items-center">
              View Gallery <ArrowRight className="ml-2" size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;