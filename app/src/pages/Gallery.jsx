import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, Loader2 } from "lucide-react";
import { getAllGalleryItems } from "../services/galleryService";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await getAllGalleryItems();
        // The API returns { statusCode, data, message, success }
        // The data field contains the array of items
        const galleryData = response.data || [];

        // Adapt backend data to frontend structure if necessary and add to state
        const adaptedItems = galleryData.map((item) => ({
          ...item,
          id: item._id, // map _id to id for compatibility
          src: item.imageUrl, // map imageUrl to src for compatibility
        }));

        setItems(adaptedItems);

        // Extract unique categories from fetched items
        const uniqueCategories = [
          "All",
          ...new Set(galleryData.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch gallery items:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#d6336c] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#d6336c] text-white rounded-full hover:bg-[#b02a5c] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h2>
          <div className="w-24 h-1 bg-[#d6336c] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            A glimpse into the work we do. Every picture tells a story of hope,
            dedication, and change.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#d6336c] text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <Motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white/50 backdrop-blur-sm border border-white/20 h-full"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#d6336c]/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.category}
                  </p>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 hover:bg-[#d6336c] hover:text-white">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
        </Motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-[#d6336c] rounded-full text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[1fr,350px] h-full">
                <div className="h-[50vh] md:h-[80vh] bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center bg-white h-full relative overflow-y-auto">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-[#d6336c]/10 text-[#d6336c] text-xs font-semibold rounded-full w-fit mb-2">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                      {selectedImage.title}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {selectedImage.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Uploaded By
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                          {selectedImage.uploadedBy.charAt(0)}
                        </div>
                        <span className="text-gray-900 font-medium">
                          {selectedImage.uploadedBy}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                    <span>ID: #{selectedImage.id}</span>
                    <span>Fularani Foundation</span>
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
