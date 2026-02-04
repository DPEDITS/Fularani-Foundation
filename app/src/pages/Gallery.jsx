import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
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
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-white text-secondary overflow-x-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>

      {/* Dynamic Header/Hero */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-[1200px] mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-6">
              Visual Chronicles
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-secondary leading-[0.9] tracking-tighter mb-10 lowercase">
              Moments of <br />
              <span className="text-white bg-primary px-6 py-2 inline-block -rotate-1 mt-2">
                hope & impact.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-tight max-w-[800px] font-bold mb-12">
              Every image tells a story of transformation. Witness the
              real-world impact of our missions through the lenses of our ground
              volunteers.
            </p>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-secondary hover:bg-black text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-tight transition-all flex items-center justify-center gap-3 group w-full sm:w-auto"
            >
              <Plus
                size={24}
                className="group-active:rotate-90 transition-transform"
              />
              Contribute Moment
            </button>
          </Motion.div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-xl border-y border-secondary/5 py-6 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center gap-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 shrink-0">
            <Filter size={18} className="text-primary" />
            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">
              Filter
            </span>
          </div>
          <div className="flex gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted/30 text-secondary/60 hover:bg-muted/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-[1200px] mx-auto py-24 px-6 relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-secondary/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">
                Curating Chronicles...
              </p>
            </div>
          ) : (
            <Motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item) => (
                <Motion.div
                  key={item.id}
                  variants={itemVariants}
                  layoutId={item.id}
                  className="group relative bg-muted/20 rounded-[40px] overflow-hidden aspect-[4/5] cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-10 flex flex-col justify-end text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                      {item.category}
                    </span>
                    <h3 className="text-3xl font-black leading-[0.9] tracking-tighter mb-6 lowercase">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-black border border-white/20">
                          {item.uploadedBy.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          {item.uploadedBy}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="p-3 rounded-xl bg-white/10 hover:bg-accent hover:text-secondary transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-3 rounded-xl bg-white/10 hover:bg-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Full Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-secondary/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-6xl bg-white rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-h-[80vh] w-full object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-8 right-8 p-4 rounded-full bg-white text-secondary shadow-2xl lg:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="w-full lg:w-[450px] p-12 md:p-16 flex flex-col">
                <div className="flex items-center justify-between mb-12">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {selectedImage.category}
                  </span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="hidden lg:block text-secondary/20 hover:text-secondary transition-colors"
                  >
                    <X size={32} />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-5xl font-black tracking-tighter leading-[0.8] mb-12 lowercase">
                    {selectedImage.title}
                  </h2>

                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-4">
                        The Story
                      </h4>
                      <p className="text-xl text-secondary font-bold leading-tight">
                        {selectedImage.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-secondary/5">
                      <div>
                        <div className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-2">
                          Source
                        </div>
                        <p className="font-black text-lg lowercase tracking-tight">
                          {selectedImage.uploadedBy}
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-2">
                          Date
                        </div>
                        <p className="font-black text-lg lowercase tracking-tight">
                          {new Date(
                            selectedImage.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <button
                    onClick={() => {
                      window.location.href = "/donor-register";
                      setSelectedImage(null);
                    }}
                    className="w-full h-20 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Support This Mission <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* modern Modal logic... keeping original functionality with new UI */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/60 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setIsUploadModalOpen(false)}
          >
            <Motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border-2 border-secondary/5 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-12 flex justify-between items-center border-b border-secondary/5">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter lowercase leading-none">
                    {editingItem ? "Refine story" : "new chronicle."}
                  </h3>
                  <p className="text-secondary/40 font-bold uppercase text-[10px] tracking-widest mt-2">
                    Shaping history, one frame at a time.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-4 rounded-full bg-muted/30 text-secondary hover:bg-secondary hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleUploadSubmit}
                className="p-12 space-y-10 overflow-y-auto max-h-[70vh] no-scrollbar"
              >
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-3 block ml-1">
                          Moment Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={uploadFormData.title}
                          onChange={handleInputChange}
                          className="w-full h-16 px-6 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-lg placeholder:text-gray-300"
                          placeholder="e.g. dawn of Hope"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-3 block ml-1">
                          Mission Category
                        </label>
                        <select
                          name="category"
                          value={uploadFormData.category}
                          onChange={handleInputChange}
                          className="w-full h-16 px-6 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none font-black appearance-none cursor-pointer"
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
                    </div>
                    <div className="relative group">
                      <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-3 block ml-1">
                        Visual File
                      </label>
                      <div className="h-[156px] rounded-3xl bg-muted/20 border-2 border-dashed border-secondary/10 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          required={!editingItem}
                        />
                        <ImageIcon
                          className="text-secondary/20 mb-2 group-hover:text-primary transition-colors"
                          size={32}
                        />
                        <span className="text-[10px] font-black uppercase text-secondary/40 px-6 text-center">
                          {uploadFormData.imageUrl
                            ? uploadFormData.imageUrl.name
                            : "Tap to upload image"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-3 block ml-1">
                      The Narrative
                    </label>
                    <textarea
                      name="description"
                      value={uploadFormData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-6 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none font-black resize-none placeholder:text-gray-300"
                      placeholder="What happened in this moment?"
                      required
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full h-20 bg-primary text-white rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isUploading ? (
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                  ) : editingItem ? (
                    "Update Story"
                  ) : (
                    "Publish Moment"
                  )}
                </button>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
