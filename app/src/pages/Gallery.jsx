import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Filter,
  ArrowRight,
  Maximize2,
  Heart,
  Calendar,
  User,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAllGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "../services/galleryService";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    category: "",
    description: "",
    uploadedBy: "",
    imageUrl: null,
  });

  const categories = [
    "All",
    "Mission Education",
    "Mission Green",
    "Mission Period Pride",
    "Mission Mobility",
    "Mission Thalassemia",
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await getAllGalleryItems();
      const galleryData = response.data || [];

      const adaptedItems = galleryData.map((item) => ({
        ...item,
        id: item._id,
        src: item.imageUrl,
      }));

      setItems(adaptedItems);
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFormData((prev) => ({ ...prev, imageUrl: e.target.files[0] }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (
      (!uploadFormData.imageUrl && !editingItem) ||
      !uploadFormData.title ||
      !uploadFormData.category ||
      !uploadFormData.description
    ) {
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("title", uploadFormData.title);
      formData.append("category", uploadFormData.category);
      formData.append("description", uploadFormData.description);
      formData.append("uploadedBy", uploadFormData.uploadedBy || "Anonymous");
      if (uploadFormData.imageUrl) {
        formData.append("imageUrl", uploadFormData.imageUrl);
      }

      if (editingItem) {
        await updateGalleryItem(editingItem._id || editingItem.id, formData);
      } else {
        await createGalleryItem(formData);
      }

      setIsUploadModalOpen(false);
      setEditingItem(null);
      setUploadFormData({
        title: "",
        category: "",
        description: "",
        uploadedBy: "",
        imageUrl: null,
      });
      fetchGalleryItems();
    } catch (error) {
      console.error("Operation failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setUploadFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      uploadedBy: item.uploadedBy,
      imageUrl: null,
    });
    setIsUploadModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteGalleryItem(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedImage?.id === id) setSelectedImage(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#f1f2f6] text-[#1d1d1f] overflow-x-hidden font-sans">
      {/* Dynamic Header/Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-emerald-100 text-emerald-700 rounded-full">
              Visual Chronicles
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95]">
              Moments of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Hope & Impact.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#86868b] font-medium leading-relaxed mb-12">
              Every image tells a story of transformation. Witness the
              real-world impact of our missions through the lenses of those on
              the ground.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="group relative px-8 py-4 bg-[#1d1d1f] text-white rounded-2xl font-bold flex items-center gap-3 overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus
                  size={20}
                  className="relative z-10 group-hover:rotate-90 transition-transform duration-500"
                />
                <span className="relative z-10">Contribute Image</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-200/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#fbfbfd]/80 backdrop-blur-xl border-y border-black/5 py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#86868b]" />
            <span className="text-sm font-bold text-[#86868b] uppercase tracking-wider whitespace-nowrap mr-4">
              Filter By
            </span>
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                    : "bg-white text-[#1d1d1f] hover:bg-gray-50 border border-black/[0.03]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-[1400px] mx-auto py-16 px-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-[#86868b] font-bold animate-pulse">
                Curating Gallery...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-40">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Info size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Unavailable</h3>
              <p className="text-[#86868b] max-w-sm mx-auto mb-8">{error}</p>
              <button
                onClick={fetchGalleryItems}
                className="px-8 py-3 bg-[#1d1d1f] text-white rounded-xl font-bold"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layoutId={item.id}
                    className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer aspect-[3/4]"
                    onClick={() => setSelectedImage(item)}
                  >
                    {/* Image Layer */}
                    <img
                      src={item.src}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 border border-white/20">
                          {item.category}
                        </span>
                        <h3 className="text-2xl font-bold leading-tight group-hover:translate-y-[-4px] transition-transform duration-500">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold border border-white/10">
                            {item.uploadedBy.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-white/80">
                            {item.uploadedBy}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="p-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white transition-all border border-white/10"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, item.id)}
                            className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white transition-all border border-white/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick View Button */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-500">
                      <div className="p-3 rounded-full bg-white text-black shadow-xl">
                        <Maximize2 size={18} />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-50">
                  <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center mb-8 border border-dashed border-gray-300">
                    <ImageIcon size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Awaiting Stories</h3>
                  <p className="text-lg max-w-sm">
                    We're just getting started with this category. Be the first
                    to share a moment.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lightbox / Full Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[1400px] h-full md:h-[90vh] bg-white rounded-none md:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Control / Viewport */}
              <div className="flex-1 bg-[#121212] relative group overflow-hidden flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Internal Navigation Buttons (Placeholders) */}
                <button className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all opacity-0 group-hover:opacity-100">
                  <ChevronLeft size={24} />
                </button>
                <button className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all opacity-0 group-hover:opacity-100">
                  <ChevronRight size={24} />
                </button>

                {/* Close Button Mobile */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 p-4 rounded-full bg-white text-black shadow-2xl lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Info */}
              <div className="w-full lg:w-[450px] bg-white p-8 md:p-12 flex flex-col h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-10">
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                    {selectedImage.category}
                  </span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="hidden lg:flex p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-none">
                    {selectedImage.title}
                  </h2>

                  <div className="space-y-10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
                        <Info size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#86868b] uppercase tracking-widest mb-2">
                          The Story
                        </h4>
                        <p className="text-lg text-[#1d1d1f] font-medium leading-relaxed">
                          {selectedImage.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-10 border-t border-black/5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#86868b]">
                          <User size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Contributed By
                          </span>
                        </div>
                        <p className="font-bold text-lg">
                          {selectedImage.uploadedBy}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#86868b]">
                          <Calendar size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Added On
                          </span>
                        </div>
                        <p className="font-bold text-lg">
                          {new Date(selectedImage.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-black/5">
                  <button
                    onClick={() => {
                      window.location.href = "/donor-register";
                      setSelectedImage(null);
                    }}
                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Support This Mission <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Upload/Edit Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/60 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setIsUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border border-black/5 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-10 flex justify-between items-center border-b border-black/5">
                <div>
                  <h3 className="text-3xl font-black tracking-tight">
                    {editingItem ? "Refine Story" : "New Chronicle"}
                  </h3>
                  <p className="text-[#86868b] font-medium">
                    Sharing hope, one image at a time.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-4 rounded-full bg-gray-50 text-black hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleUploadSubmit}
                className="p-10 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black text-[#86868b] mb-3 uppercase tracking-[0.2em] ml-1">
                      Title your moment
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={uploadFormData.title}
                      onChange={handleInputChange}
                      className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold text-lg placeholder:text-gray-300"
                      placeholder="E.g. The First Day of School"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-[#86868b] mb-3 uppercase tracking-[0.2em] ml-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={uploadFormData.category}
                        onChange={handleInputChange}
                        className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Mission Select</option>
                        {categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-[#86868b] mb-3 uppercase tracking-[0.2em] ml-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="uploadedBy"
                        value={uploadFormData.uploadedBy}
                        onChange={handleInputChange}
                        className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold placeholder:text-gray-300"
                        placeholder="Anonymous"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-[#86868b] mb-3 uppercase tracking-[0.2em] ml-1">
                      The Story Behind
                    </label>
                    <textarea
                      name="description"
                      value={uploadFormData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-bold resize-none placeholder:text-gray-300"
                      placeholder="Describe the impact of this moment..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-[#86868b] mb-3 uppercase tracking-[0.2em] ml-1">
                      Visual Evidence
                    </label>
                    <div className="relative h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/10 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required={!editingItem}
                      />
                      <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                        <ImageIcon
                          className="text-gray-400 group-hover:text-emerald-500 transition-colors"
                          size={24}
                        />
                        <span className="text-sm font-bold text-gray-500">
                          {uploadFormData.imageUrl
                            ? uploadFormData.imageUrl.name
                            : "Tap to upload high-res image"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full h-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl font-black text-xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isUploading ? (
                      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : editingItem ? (
                      "Update Chronicle"
                    ) : (
                      "Publish to Gallery"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
