import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

const PhotoGallery = () => {
  const { currentTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample photos - using placeholder images
  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=600&fit=crop",
      alt: "Engagement photo 1",
      category: "engagement"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop",
      alt: "Engagement photo 2", 
      category: "engagement"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop",
      alt: "Couple photo 1",
      category: "couple"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=600&fit=crop",
      alt: "Couple photo 2",
      category: "couple"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=600&fit=crop",
      alt: "Pre-wedding photo 1",
      category: "prewedding"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=600&fit=crop",
      alt: "Pre-wedding photo 2",
      category: "prewedding"
    }
  ];

  const openModal = (photo, index) => {
    setSelectedImage(photo);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(photos[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(photos[prevIndex]);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-3">
          <Camera className={`text-${currentTheme.accent} mr-2`} size={24} />
          <h2 className="text-2xl font-bold">Our Journey Together</h2>
        </div>
        <p className={`text-${currentTheme.textSecondary} text-sm max-w-xs mx-auto`}>
          Capturing beautiful moments from our love story
        </p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[3/4]"
            onClick={() => openModal(photo, index)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium capitalize">
                  {photo.category}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-sm max-h-full p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image info */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="text-white text-sm font-medium capitalize mb-1">
                {selectedImage.category}
              </p>
              <p className="text-white/70 text-xs">
                {currentIndex + 1} of {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quote */}
      <div className={`bg-${currentTheme.card} backdrop-blur-md rounded-2xl p-6 border border-${currentTheme.border} shadow-xl text-center max-w-sm mx-auto`}>
        <blockquote className={`text-${currentTheme.textSecondary} italic text-sm leading-relaxed mb-3`}>
          "Every picture tells a story, but our love story is just beginning."
        </blockquote>
        <p className={`text-${currentTheme.accent} font-semibold text-sm`}>
          - Anindias & Fachry
        </p>
      </div>
    </div>
  );
};

export default PhotoGallery;