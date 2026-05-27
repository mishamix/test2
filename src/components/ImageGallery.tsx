import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export default function ImageGallery({ images, alt = 'Property image' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 bg-secondary-100 dark:bg-secondary-800 rounded-xl flex items-center justify-center">
        <p className="text-secondary-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative aspect-[16/10] md:row-span-2 rounded-xl overflow-hidden cursor-pointer group">
          <img
            src={images[0]}
            alt={`${alt} 1`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => openLightbox(0)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-10 h-10 text-white" />
          </div>
        </div>

        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={image}
              alt={`${alt} ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onClick={() => openLightbox(index + 1)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
            {index === 3 && images.length > 5 && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                onClick={() => openLightbox(4)}
              >
                <span className="text-white text-xl font-semibold">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />

          <button
            onClick={goToNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
