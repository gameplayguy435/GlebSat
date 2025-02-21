import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleries = {
    development: [
      { id: 1, url: "/api/placeholder/400/300", title: "Initial Prototype Assembly" },
      { id: 2, url: "/api/placeholder/400/300", title: "Sensor Calibration" },
      { id: 3, url: "/api/placeholder/400/300", title: "Testing Phase" }
    ],
    mission: [
      { id: 4, url: "/api/placeholder/400/300", title: "Launch Preparation" },
      { id: 5, url: "/api/placeholder/400/300", title: "Deployment" },
      { id: 6, url: "/api/placeholder/400/300", title: "First Orbital Images" }
    ],
    process: [
      { id: 7, url: "/api/placeholder/400/300", title: "Team Planning Session" },
      { id: 8, url: "/api/placeholder/400/300", title: "Component Integration" },
      { id: 9, url: "/api/placeholder/400/300", title: "Quality Control" }
    ]
  };

  const ImageModal = ({ image, onClose }) => {
    return (
      <AnimatePresence>
        {image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={onClose}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X size={24} />
              </button>
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <p className="text-white text-center mt-4 text-lg">{image.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const GallerySection = ({ title, images }) => (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-100">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {images.map((image) => (
          <motion.div
            key={image.id}
            whileHover={{ y: -5 }}
            className="cursor-pointer group relative"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-square bg-slate-700 rounded-xl overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-xl">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-lg font-semibold p-2 text-center">
                  {image.title}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-4xl font-bold mb-12 text-slate-100"
        >
          Project Gallery
        </motion.h1>

        <GallerySection title="Development Process" images={galleries.development} />
        <GallerySection title="Mission Images" images={galleries.mission} />
        <GallerySection title="Documentation Process" images={galleries.process} />

        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  );
};

export default GalleryPage;