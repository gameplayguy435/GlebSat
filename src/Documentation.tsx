import React from 'react';
import { BookOpen, Cpu, Target, Settings } from 'lucide-react';

const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Project Documentation</h1>
        
        {/* Technical Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">Technical Overview</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our microsatellite project utilizes cutting-edge technology to monitor atmospheric conditions
            and environmental parameters in real-time. The satellite employs multiple sensors for data
            collection and transmission, providing valuable insights into air quality and climate patterns.
          </p>
        </div>

        {/* Objectives Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <Target className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">Objectives & Methodology</h2>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold mb-2">Primary Objectives</h3>
              <p className="text-gray-600">
                To collect and analyze atmospheric data for environmental monitoring and research purposes.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold mb-2">Research Methodology</h3>
              <p className="text-gray-600">
                Utilizing advanced sensing technology and data analysis algorithms for accurate measurements.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Components */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <Cpu className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">Technical Components</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Sensor Array</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Air quality sensors</li>
                <li>Temperature sensors</li>
                <li>Humidity sensors</li>
                <li>Atmospheric pressure sensors</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Communication Systems</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Data transmission module</li>
                <li>Signal processing unit</li>
                <li>Ground station interface</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <Settings className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">How It Works</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-3">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Data Collection</h3>
                <p className="text-gray-600">Sensors continuously gather atmospheric data</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-3">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Processing</h3>
                <p className="text-gray-600">Onboard systems process and validate collected data</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-3">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Transmission</h3>
                <p className="text-gray-600">Data is transmitted to ground stations in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;