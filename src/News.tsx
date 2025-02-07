import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Latest News</h1>

        {/* Featured News */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src="/api/placeholder/800/600" 
                alt="Featured news" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="text-sm text-blue-600 mb-2">Featured Story</div>
              <h2 className="text-2xl font-bold mb-4">Major Breakthrough in Atmospheric Data Collection</h2>
              <p className="text-gray-600 mb-4">
                Our team has achieved a significant milestone in atmospheric data collection,
                enabling more precise measurements of air quality parameters at various altitudes.
              </p>
              <div className="flex items-center text-gray-500 mb-6">
                <Calendar size={16} className="mr-2" />
                <span>February 5, 2025</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-blue-600 mb-2">{item.category}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.summary}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <a href="#" className="text-blue-600 flex items-center hover:text-blue-700">
                  Read More <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;