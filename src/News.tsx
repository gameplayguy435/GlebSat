import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const NewsPage = () => {
  const newsItems = [
    {
      title: "Successful Launch of MicroSat-1",
      date: "2025-02-01",
      summary: "Our first microsatellite successfully launched and deployed into low Earth orbit.",
      image: "/api/placeholder/400/250",
      category: "Mission Update"
    },
    {
      title: "New Air Quality Monitoring Features",
      date: "2025-01-15",
      summary: "Enhanced sensing capabilities added to monitor additional atmospheric pollutants.",
      image: "/api/placeholder/400/250",
      category: "Technical Update"
    },
    {
      title: "Research Partnership Announcement",
      date: "2025-01-01",
      summary: "New collaboration with leading environmental research institutions.",
      image: "/api/placeholder/400/250",
      category: "Partnership"
    }
  ];

return (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 py-12">
    <div className="max-w-7xl mx-auto px-4">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-4xl font-bold mb-12 text-slate-100"
      >
        Latest News
      </motion.h1>

      {/* Featured News */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-slate-700 rounded-xl shadow-xl overflow-hidden mb-12"
      >
        <div className="md:flex">
          <div className="md:w-1/2 bg-slate-800">
            <div className="aspect-video animate-pulse">
              <img 
                src="/api/placeholder/800/600" 
                alt="Featured news" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <div className="text-sm text-blue-400 mb-2">Featured Story</div>
            <h2 className="text-2xl font-bold mb-4 text-slate-100">
              Major Breakthrough in Atmospheric Data Collection
            </h2>
            <p className="text-slate-300 mb-4">
              Our team has achieved a significant milestone in atmospheric data collection,
              enabling more precise measurements of air quality parameters at various altitudes.
            </p>
            <div className="flex items-center text-slate-400 mb-6">
              <Calendar size={16} className="mr-2" />
              <span>February 5, 2025</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Read More
            </motion.button>
          </div>
        </div>
      </motion.div>

        {/* News Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="grid md:grid-cols-3 gap-8"
        >
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-slate-700 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="aspect-video bg-slate-800 animate-pulse">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-400 mb-2">{item.category}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-100">{item.title}</h3>
                <p className="text-slate-300 mb-4">{item.summary}</p>
                <div className="flex items-center text-slate-400 mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="text-blue-400 flex items-center hover:text-blue-300"
                >
                  Read More <ArrowRight size={16} className="ml-2" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsPage;