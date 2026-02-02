import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { galleryItems } from "../data/galleryData";

const GalleryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Randomly shuffle items on mount or just cycle through them
    // For now, let's just cycle through them every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = galleryItems[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
      <AnimatePresence mode="wait">
        <Motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentItem.src}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-24 text-white">
            <Motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-1"
            >
              {currentItem.title}
            </Motion.h3>
            <Motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-200"
            >
              {currentItem.category}
            </Motion.p>
          </div>
        </Motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {galleryItems.slice(0, 5).map(
          (
            _,
            idx, // Show first 5 dots only to avoid clutter
          ) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex % 5 ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default GalleryCarousel;
