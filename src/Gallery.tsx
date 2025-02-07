import React, { useState } from 'react';
import { X } from 'lucide-react';

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
    if (!image) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl w-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-auto rounded-lg"
          />
          <p className="text-white text-center mt-4 text-lg">{image.title}</p>
        </div>
      </div>
    );
  };

  const GallerySection = ({ title, images }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="cursor-pointer group relative"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-lg font-semibold p-2 text-center">
                  {image.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">Project Gallery</h1>

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