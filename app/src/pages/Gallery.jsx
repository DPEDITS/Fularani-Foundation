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
    "Mission Thalasemia",
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
        alert("Image updated successfully!");
      } else {
        await createGalleryItem(formData);
        alert("Image uploaded successfully!");
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
      window.location.reload();
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

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d6336c] to-[#FF6B6B] text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Image
          </button>
        </div>

        <Motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
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
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                        title="Edit Image"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-[#d6336c] hover:text-white">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Motion.div>
              ))
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#d6336c]/20 to-[#FF6B6B]/20 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[#d6336c]/60" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-500 max-w-md">
                  We're working on adding amazing photos for {activeCategory}.
                  Check back soon!
                </p>
              </Motion.div>
            )}
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

      <AnimatePresence>
        {isUploadModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 bg-[#d6336c] text-white flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload to Gallery
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={uploadFormData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d6336c] focus:border-transparent outline-none transition-all"
                    placeholder="Enter image title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={uploadFormData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d6336c] focus:border-transparent outline-none transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Mission Education">Mission Education</option>
                    <option value="Mission Green">Mission Green</option>
                    <option value="Mission Period Pride">
                      Mission Period Pride
                    </option>
                    <option value="Mission Mobility">Mission Mobility</option>
                    <option value="Mission Thalasemia">
                      Mission Thalasemia
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={uploadFormData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d6336c] focus:border-transparent outline-none transition-all"
                    placeholder="Tell the story behind this image..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uploaded By
                  </label>
                  <input
                    type="text"
                    name="uploadedBy"
                    value={uploadFormData.uploadedBy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d6336c] focus:border-transparent outline-none transition-all"
                    placeholder="Your name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#d6336c] transition-colors text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      {uploadFormData.imageUrl ? (
                        <div className="flex items-center gap-2 text-[#d6336c] font-medium">
                          <ImageIcon className="w-5 h-5" />
                          <span>{uploadFormData.imageUrl.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm">Click to upload image</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 bg-[#d6336c] text-white rounded-lg hover:bg-[#b02a5c] transition-colors font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload Image"
                    )}
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
