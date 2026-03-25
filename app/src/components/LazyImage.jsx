import React, { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";

const LazyImage = ({ src, alt, className, imgClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Apply auto-format and auto-quality for better performance
  const optimizedSrc = getSecureCloudinaryUrl(src, "f_auto,q_auto");

  useEffect(() => {
    // If image is already in cache, it might have finished loading before this effect
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton / Placeholder */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <Motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-muted/20 animate-pulse flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin opacity-20" />
          </Motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <div className="absolute inset-0 bg-muted/10 flex items-center justify-center px-4 text-center">
          <span className="text-[10px] font-black text-secondary/20 uppercase tracking-widest">
            Moment Unavailable
          </span>
        </div>
      ) : (
        <Motion.img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover ${imgClassName || ""}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
