import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn } from "lucide-react";
import missionImg from "../assets/missions1.jpeg";

const categories = [
  "All",
  "Mission Education for all",
  "Mission Green",
  "Mission Period Pride",
  "Mission Mobility",
  "Mission Thalassemia",
];

const galleryItems = [
  {
    id: 1,
    title: "School Supplies Distribution",
    category: "Mission Education for all",
    uploadedBy: "Rahul Sharma",
    src: missionImg,
    description:
      "Distributing books and stationery to underprivileged children in rural schools.",
  },
  {
    id: 2,
    title: "Free Health Checkup",
    category: "Mission Period Pride",
    uploadedBy: "Dr. Anjali Gupta",
    src: missionImg,
    description:
      "Providing free medical checkups and medicines to the elderly.",
  },
  {
    id: 3,
    title: "Tree Plantation Drive",
    category: "Mission Green",
    uploadedBy: "Vikram Singh",
    src: missionImg,
    description: "Planting 500 saplings to promote a greener environment.",
  },
  {
    id: 4,
    title: "Monthly Ration Kit",
    category: "Mission Thalassemia",
    uploadedBy: "Priya Das",
    src: missionImg,
    description:
      "Ensuring food security for families in need with monthly ration kits.",
  },
  {
    id: 5,
    title: "Skill Development Workshop",
    category: "Mission Mobility",
    uploadedBy: "Meera Reddy",  
    src: missionImg,
    description:
      "Training women in tailoring and handicrafts for financial independence.",
  },
  {
    id: 6,
    title: "Digital Literacy Class",
    category: "Mission Education for all",
    uploadedBy: "Amit Patel",
    src: missionImg,
    description: "Teaching basic computer skills to students.",
  },
  {
    id: 7,
    title: "Eye Checkup Camp",
    category: "Mission Period Pride",
    uploadedBy: "Dr. Raj Malhotra",
    src: missionImg,
    description: "Specialized eye care camp for cataract screening.",
  },
  {
    id: 8,
    title: "Cleanliness Drive",
    category: "Mission Green",
    uploadedBy: "Team Green",
    src: missionImg,
    description: "Cleaning up the local river banks and spreading awareness.",
  },
  {
    id: 9,
    title: "Community Kitchen",
    category: "Mission Nutrition",
    uploadedBy: "Suresh Kumar",
    src: missionImg,
    description: "Serving hot meals to daily wage workers.",
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

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

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
