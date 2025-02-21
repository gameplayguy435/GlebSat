import { motion } from 'framer-motion';
import { BookOpen, Cpu, Target, Settings } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-4xl font-bold mb-12 text-slate-100"
        >
          Project Documentation
        </motion.h1>

        {/* Technical Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-slate-700 rounded-xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <BookOpen className="text-blue-400 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-slate-100">Technical Overview</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Our microsatellite project utilizes cutting-edge technology to monitor atmospheric conditions
            and environmental parameters in real-time. The satellite employs multiple sensors for data
            collection and transmission, providing valuable insights into air quality and climate patterns.
          </p>
        </motion.div>

        {/* Objectives Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-slate-700 rounded-xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <Target className="text-blue-400 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-slate-100">Objectives & Methodology</h2>
          </div>
          <div className="space-y-4">
            <motion.div 
              whileHover={{ x: 5 }}
              className="border-l-4 border-blue-400 pl-4"
            >
              <h3 className="font-semibold mb-2 text-slate-100">Primary Objectives</h3>
              <p className="text-slate-300">
                To collect and analyze atmospheric data for environmental monitoring and research purposes.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="border-l-4 border-blue-400 pl-4"
            >
              <h3 className="font-semibold mb-2 text-slate-100">Research Methodology</h3>
              <p className="text-slate-300">
                Utilizing advanced sensing technology and data analysis algorithms for accurate measurements.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Technical Components */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-slate-700 rounded-xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center mb-4">
            <Cpu className="text-blue-400 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-slate-100">Technical Components</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {['Sensor Array', 'Communication Systems'].map((title, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-slate-800 p-6 rounded-lg"
              >
                <h3 className="font-semibold mb-4 text-slate-100">{title}</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  {title === 'Sensor Array' ? (
                    <>
                      <li>Air quality sensors</li>
                      <li>Temperature sensors</li>
                      <li>Humidity sensors</li>
                      <li>Atmospheric pressure sensors</li>
                    </>
                  ) : (
                    <>
                      <li>Data transmission module</li>
                      <li>Signal processing unit</li>
                      <li>Ground station interface</li>
                    </>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-slate-700 rounded-xl shadow-xl p-8"
        >
          <div className="flex items-center mb-4">
            <Settings className="text-blue-400 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-slate-100">How It Works</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-blue-400 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-3">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-slate-100">
                    {['Data Collection', 'Processing', 'Transmission'][step - 1]}
                  </h3>
                  <p className="text-slate-300">
                    {[
                      'Sensors continuously gather atmospheric data',
                      'Onboard systems process and validate collected data',
                      'Data is transmitted to ground stations in real-time'
                    ][step - 1]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentationPage;