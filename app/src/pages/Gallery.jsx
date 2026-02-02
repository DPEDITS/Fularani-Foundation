import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import {
  X,
  ZoomIn,
  Loader2,
  Plus,
  Upload,
  Image as ImageIcon,
  Edit2,
  Trash2,
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
  const categories = [
    "All",
    "Mission Education",
    "Mission Green",
    "Mission Period Pride",
    "Mission Mobility",
    "Mission Thalassemia",
  ];
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    category: "",
    description: "",
    uploadedBy: "",
    imageUrl: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
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

    fetchGalleryItems();
  }, []);

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
      alert("Please fill in all required fields.");
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
      const response = await getAllGalleryItems();
      const galleryData = response.data || [];
      const adaptedItems = galleryData.map((item) => ({
        ...item,
        id: item._id,
        src: item.imageUrl,
      }));
      setItems(adaptedItems);
    } catch (error) {
      console.error("Operation failed", error);
      alert("Failed to save. Please try again.");
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
      } catch (error) {
        console.error(error);
        alert("Failed to delete image.");
      }
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#fbfbfd]">
        <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Something went wrong</h2>
        <p className="text-[#86868b] mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#0071e3] text-white rounded-full hover:bg-[#0077ed] transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-6 bg-[#fbfbfd]">
      <div className="max-w-[1024px] mx-auto">
        <div className="text-center mb-16">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-[48px] md:text-[56px] font-bold text-[#1d1d1f] tracking-tight mb-4">
              Our Gallery.
            </h1>
            <p className="text-[19px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto mb-12 font-medium">
              Capturing moments of hope, dedication, and the lasting impact
              we create together.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${activeCategory === category
                    ? "bg-[#1d1d1f] text-white"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#0066cc] hover:underline font-medium text-[17px] group mb-8"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Add to Gallery
            </button>
          </Motion.div>
        </div>

        <Motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="apple-card group relative cursor-pointer overflow-hidden aspect-[4/5]"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-white text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{item.category}</p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#ff3b30] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Motion.div>
              ))
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto">
                  <ImageIcon className="w-10 h-10 text-[#86868b]" />
                </div>
                <h3 className="text-[24px] font-bold text-[#1d1d1f] mb-2">Coming Soon</h3>
                <p className="text-[#86868b] max-w-sm mx-auto font-medium">
                  We're curating beautiful moments for {activeCategory}.
                  Check back for updates.
                </p>
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/80 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative max-w-[1100px] w-full bg-white rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-full flex items-center justify-center text-[#1d1d1f] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px]">
                <div className="bg-[#f5f5f7] flex items-center justify-center min-h-[400px] lg:h-[80vh]">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-10 lg:p-12 flex flex-col justify-center bg-white h-full relative">
                  <span className="text-[#0071e3] font-bold text-[13px] tracking-wide uppercase mb-3">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] leading-tight mb-6">
                    {selectedImage.title}
                  </h3>
                  <p className="text-[17px] text-[#86868b] leading-relaxed mb-10 font-medium">
                    {selectedImage.description}
                  </p>

                  <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] font-bold text-sm">
                      {selectedImage.uploadedBy.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-[#86868b] font-medium">Contributed by</span>
                      <span className="text-[16px] text-[#1d1d1f] font-bold">{selectedImage.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/60 backdrop-blur-xl"
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] w-full max-w-lg overflow-hidden border border-black/5"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1d1d1f]">Add to Gallery</h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#f5f5f7] flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadFormData.title}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f]"
                    placeholder="E.g. Empowering Students"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight">Category</label>
                  <select
                    name="category"
                    value={uploadFormData.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight">Description</label>
                  <textarea
                    name="description"
                    value={uploadFormData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-4 rounded-xl bg-[#f5f5f7] border-none focus:ring-2 focus:ring-[#0071e3] transition-all outline-none text-[#1d1d1f] resize-none"
                    placeholder="Tell the story..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#1d1d1f] mb-2 uppercase tracking-tight">Image</label>
                  <div className="relative h-24 rounded-xl bg-[#f5f5f7] border-2 border-dashed border-[#d2d2d7] hover:border-[#0071e3] transition-colors flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!editingItem}
                    />
                    <div className="flex flex-col items-center text-[#86868b] pointer-events-none">
                      {uploadFormData.imageUrl ? (
                        <span className="text-[#0071e3] font-bold text-sm truncate max-w-[200px]">
                          {uploadFormData.imageUrl.name}
                        </span>
                      ) : (
                        <span className="text-sm font-medium">Click to choose image</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full h-12 bg-[#0071e3] text-white rounded-full font-bold hover:bg-[#0077ed] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : "Save to Gallery"}
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default Gallery;
