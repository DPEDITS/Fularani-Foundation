import React, { useState, useEffect, useMemo } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { motion as Motion, AnimatePresence } from "motion/react";
import LazyImage from "../components/LazyImage";
import { Plus, Filter, Search, Edit2, Trash2, X, Tag, Check } from "lucide-react";
import {
  getAllGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "../services/galleryService";
import { getDonorUser } from "../services/donorService";
import { getVolunteerUser } from "../services/volunteerService";
import { getAdminUser } from "../services/adminService";
import GalleryDetailModal from "../components/GalleryDetailModal";
import GalleryUploadModal from "../components/GalleryUploadModal";
import { galleryItems as staticGalleryItems } from "../data/galleryData";

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

const Gallery = () => {
  const donor = getDonorUser();
  const volunteer = getVolunteerUser();
  const admin = getAdminUser();
  const currentUser = donor || volunteer || admin;
  const adminEmails = [
    "debashishparida75@gmail.com",
    "abhijeetduttaam2222@gmail.com",
    "abhijeetdashx@gmail.com",
  ];
  const isAuthorizedUser = admin && adminEmails.includes(currentUser?.email);

  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [isTitleFilterOpen, setIsTitleFilterOpen] = useState(false);
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
    imageFiles: [],
    imageLink: "",
  });

  const categories = [
    "All",
    "Mission Education",
    "Mission Green",
    "Mission Healthcare",
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await getAllGalleryItems();
      const galleryData = response.data || [];
      const adaptedItems = galleryData
        .map((item) => ({
          ...item,
          id: item._id,
          src: item.imageUrl,
        }));
      
      // Combine with static items
      const combinedItems = [
        ...staticGalleryItems,
        ...adaptedItems
      ].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });

      setItems(combinedItems);
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
    if (e.target.files && e.target.files.length > 0) {
      setUploadFormData((prev) => ({ 
        ...prev, 
        imageFiles: Array.from(e.target.files) 
      }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (
      (uploadFormData.imageFiles.length === 0 && !uploadFormData.imageLink && !editingItem) ||
      !uploadFormData.title ||
      !uploadFormData.category
    )
      return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const validFiles = [];
    const oversizedFiles = [];

    if (uploadFormData.imageFiles.length > 0) {
      uploadFormData.imageFiles.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      });
    }

    if (
      validFiles.length === 0 &&
      !uploadFormData.imageLink &&
      !editingItem &&
      oversizedFiles.length > 0
    ) {
      alert(`All selected files exceed 5MB and cannot be uploaded:\n\n${oversizedFiles.join('\n')}`);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("title", uploadFormData.title);
      formData.append("category", uploadFormData.category);
      formData.append("description", uploadFormData.description);
      formData.append(
        "uploadedBy",
        uploadFormData.uploadedBy || currentUser?.username || "Anonymous",
      );
      if (validFiles.length > 0) {
        validFiles.forEach((file) => {
          if (editingItem) {
            formData.append("imageUrl", file);
          } else {
            formData.append("images", file);
          }
        });
      } else if (uploadFormData.imageLink) {
        formData.append("imageLink", uploadFormData.imageLink);
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
        imageFiles: [],
        imageLink: "",
      });
      await fetchGalleryItems();

      if (oversizedFiles.length > 0) {
        alert(
          `The following images exceeded 5MB and were skipped:\n\n${oversizedFiles.join('\n')}`
        );
      }
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
      imageFiles: [],
      imageLink: item.src || "",
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

  // Extract unique titles dynamically — scoped to active category
  const uniqueTitles = useMemo(() => {
    const pool = activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);
    const titleSet = new Set(pool.map((item) => item.title).filter(Boolean));
    return [...titleSet].sort();
  }, [items, activeCategory]);

  // Auto-clear selected titles that no longer exist in the current category
  useEffect(() => {
    setSelectedTitles((prev) =>
      prev.filter((t) => uniqueTitles.includes(t))
    );
  }, [uniqueTitles]);

  const handleTitleToggle = (title) => {
    setSelectedTitles((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const clearTitleFilters = () => {
    setSelectedTitles([]);
  };

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategory !== "All") {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (selectedTitles.length > 0) {
      result = result.filter((item) => selectedTitles.includes(item.title));
    }
    return result;
  }, [items, activeCategory, selectedTitles]);

  return (
    <div className="min-h-screen bg-white text-secondary overflow-x-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>

      <section className="relative pt-30 pb-20 px-6 z-10">
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
            {isAuthorizedUser && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-secondary hover:bg-black text-white px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-tight transition-all flex items-center justify-center gap-3 group w-full sm:w-auto"
              >
                <Plus
                  size={24}
                  className="group-active:rotate-90 transition-transform"
                />{" "}
                Contribute Moment
              </button>
            )}
          </Motion.div>
        </div>
      </section>

      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-xl border-y border-secondary/5 py-4 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Category Filter Row */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 shrink-0">
              <Filter size={18} className="text-primary" />
              <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">
                Category
              </span>
            </div>
            <div className="flex gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all whitespace-nowrap ${activeCategory === category ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/30 text-secondary/60 hover:bg-muted/50"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Title Filter Row */}
          <div className="mt-4 border-t border-secondary/5 pt-4">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => setIsTitleFilterOpen(!isTitleFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${
                  selectedTitles.length > 0
                    ? "bg-accent text-secondary shadow-lg shadow-accent/20"
                    : "bg-muted/30 text-secondary/60 hover:bg-muted/50"
                }`}
              >
                <Tag size={14} />
                Filter by Title
                {selectedTitles.length > 0 && (
                  <span className="ml-1 bg-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {selectedTitles.length}
                  </span>
                )}
              </button>

              {selectedTitles.length > 0 && (
                <button
                  onClick={clearTitleFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-all"
                >
                  <X size={12} />
                  Clear All
                </button>
              )}
            </div>

            <AnimatePresence>
              {isTitleFilterOpen && (
                <Motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pb-2">
                    {uniqueTitles.map((title) => {
                      const isSelected = selectedTitles.includes(title);
                      const count = items.filter((i) => i.title === title).length;
                      return (
                        <button
                          key={title}
                          onClick={() => handleTitleToggle(title)}
                          className={`group/chip flex items-center gap-2 pl-3 pr-3 py-2 rounded-full text-[11px] font-bold transition-all duration-300 border ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/15 scale-[1.02]"
                              : "bg-white text-secondary/70 border-secondary/10 hover:border-primary/30 hover:bg-primary/5 hover:text-secondary"
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-white/25"
                              : "bg-secondary/5 group-hover/chip:bg-primary/10"
                          }`}>
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </span>
                          {title}
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md transition-all ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-secondary/5 text-secondary/40"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            {/* Active title pills (always visible when filter is closed) */}
            {!isTitleFilterOpen && selectedTitles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTitles.map((title) => (
                  <span
                    key={title}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary pl-3 pr-2 py-1.5 rounded-full text-[11px] font-bold"
                  >
                    {title}
                    <button
                      onClick={() => handleTitleToggle(title)}
                      className="w-4 h-4 rounded-full bg-primary/20 hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                    >
                      <X size={8} strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto py-24 px-6 relative z-10">
        <AnimatePresence>
          {loading ? (
            <Motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 gap-6"
            >
              <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-secondary/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">
                Curating Chronicles...
              </p>
            </Motion.div>
          ) : (
            <Motion.div
              key={`${activeCategory}-${selectedTitles.join(",")}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item) => (
                <Motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  className="group relative bg-muted/20 rounded-[40px] overflow-hidden aspect-[4/5] cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <LazyImage
                    src={item.src}
                    alt={item.title}
                    imgClassName="transition-transform duration-1000"
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 p-10 flex flex-col justify-end text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                      {item.category}
                    </span>
                    <h3 className="text-3xl font-black leading-[0.9] tracking-tighter mb-6 lowercase">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {isAuthorizedUser && (
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
                      )}
                    </div>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedImage && (
          <GalleryDetailModal
            item={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUploadModalOpen && (
          <GalleryUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            editingItem={editingItem}
            uploadFormData={uploadFormData}
            setUploadFormData={setUploadFormData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleUploadSubmit={handleUploadSubmit}
            isUploading={isUploading}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
