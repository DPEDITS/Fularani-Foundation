import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Download, Eye, ShieldCheck, Plus, X, Loader2, Pencil, Trash2, 
  PlusCircle, MinusCircle, Search, Image as ImageIcon, File as FileIcon, ChevronLeft
} from "lucide-react";
import api from "../services/api";
import { isAdminAuthenticated, getAdminUser } from "../services/adminService";

const getDownloadLink = (url) => {
  if (!url) return "#";
  try {
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})\b/) || url.match(/id=([a-zA-Z0-9_-]{25,})\b/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
  } catch (err) {
    return url;
  }
};

import defaultImg from "../assets/missionEducation.jpeg";
import educationImg from "../assets/11_missions/mission_education.jpg";
import healthImg from "../assets/healthcarebg.JPG";
import womenImg from "../assets/11_missions/period1.jpg";
import foodImg from "../assets/storyImage/prashanti_sanskar.png";
import greenImg from "../assets/missionGreen.jpeg";
import mobilityImg from "../assets/11_missions/mobility_1.jpg";
import bloodImg from "../assets/missionHealthcare.png";
import bloodBankImg from "../assets/storyImage/blood_bank.jpg";
import ministerImg from "../assets/storyImage/pitambar_1.png";
import gymImg from "../assets/storyImage/open_gym.jpeg";
import donationImg from "../assets/about-hero.png";
import gachhaImg from "../assets/storyImage/gaccha_chai_1.jpeg";
import innovImg from "../assets/storyImage/innovation_healthcare_2.jpg";
import pitambar2Img from "../assets/storyImage/pitambar_2.png";
import lighthouseImg from "../assets/11_missions/education2.jpg";
import saharaImg from "../assets/11_missions/education3.jpg";
import missions1Img from "../assets/missions1.jpeg";
import pitambar3Img from "../assets/storyImage/pitambar_3.png";

const CATEGORY_MAP = {
  default: { hex: "#3b82f6", image: defaultImg },
  "education": { hex: "#10b981", image: educationImg },
  "health": { hex: "#f43f5e", image: healthImg },
  "women": { hex: "#a855f7", image: womenImg },
  "food": { hex: "#f59e0b", image: foodImg },
  "environment": { hex: "#22c55e", image: greenImg },
  "green": { hex: "#22c55e", image: greenImg },
  "mobility": { hex: "#0f766e", image: mobilityImg },
  "period": { hex: "#db2777", image: womenImg },
  "blood bank": { hex: "#dc2626", image: bloodBankImg },
  "blood credit": { hex: "#ef4444", image: pitambar3Img },
  "blood equipment": { hex: "#b91c1c", image: healthImg },
  "blood": { hex: "#ef4444", image: bloodImg },
  "minister": { hex: "#f59e0b", image: ministerImg },
  "cultural": { hex: "#f59e0b", image: ministerImg },
  "gym": { hex: "#8b5cf6", image: gymImg },
  "donation": { hex: "#14b8a6", image: donationImg },
  "wealth": { hex: "#84cc16", image: greenImg },
  "thalassemia": { hex: "#ff3b30", image: missions1Img },
  "gachha": { hex: "#16a34a", image: gachhaImg },
  "industrial": { hex: "#0284c7", image: pitambar2Img },
  "nursio": { hex: "#0d9488", image: innovImg },
  "lighthouse": { hex: "#ca8a04", image: lighthouseImg },
  "sahara": { hex: "#ea580c", image: saharaImg },
};

const getCategoryStyles = (title) => {
  const t = title.toLowerCase();
  const keys = Object.keys(CATEGORY_MAP).filter(k => k !== "default").sort((a, b) => b.length - a.length);
  const key = keys.find(k => t.includes(k));
  return CATEGORY_MAP[key] || CATEGORY_MAP.default;
};

const getFileTypeInfo = (name, link) => {
  const str = (name + " " + link).toLowerCase();
  if (str.includes('.pdf') || str.includes('pdf')) return { type: 'PDF', icon: FileText, color: 'text-red-400', bg: 'bg-red-400/10' };
  if (str.includes('.doc') || str.includes('word')) return { type: 'Word', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' };
  if (str.includes('.xls') || str.includes('excel') || str.includes('sheet')) return { type: 'Excel', icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10' };
  if (str.match(/\.(jpg|jpeg|png|gif)/) || str.includes('image') || str.includes('photo')) return { type: 'Image', icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' };
  return { type: 'Document', icon: FileIcon, color: 'text-gray-400', bg: 'bg-gray-400/10' };
};

const MissionCard = ({ mission, index, onClick }) => {
  const styles = getCategoryStyles(mission.title);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick(mission)}
      className="group relative h-56 md:h-72 rounded-3xl overflow-hidden cursor-pointer bg-[#111] border border-white/10 hover:border-white/20 transition-all shadow-lg"
      style={{ '--hover-color': styles.hex }}
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={styles.image} 
          alt={mission.title} 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-in-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: styles.hex }} />
      </div>
      
      <div className="absolute inset-0 z-10 p-5 md:p-6 flex flex-col justify-end">
        <div className="flex justify-between items-end gap-4">
          <div className="min-w-0">
            <span 
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 shadow-md"
              style={{ backgroundColor: styles.hex + '20', color: styles.hex, border: `1px solid ${styles.hex}40` }}
            >
              {mission.documents.length} {mission.documents.length === 1 ? 'Record' : 'Records'}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white capitalize truncate group-hover:text-[var(--hover-color)] group-hover:translate-x-1 transition-all duration-300 drop-shadow-lg">
              {mission.title}
            </h2>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-300" style={{ backgroundColor: styles.hex }}>
            <FileText size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DocumentDrawer = ({ mission, isOpen, onClose, isSuperAdmin, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setSearchQuery("");
    setActiveFilter("All");
  }, [mission]);

  if (!mission) return null;

  const styles = getCategoryStyles(mission.title);
  const filters = ["All", "PDF", "Word", "Excel", "Image", "Document"];

  const filteredDocs = mission.documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const fileInfo = getFileTypeInfo(doc.name, doc.link);
    const matchesFilter = activeFilter === "All" || fileInfo.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[45%] lg:w-[40%] h-full bg-[#0a0a0a] z-50 shadow-2xl flex flex-col border-l border-white/5"
          >
            {/* Drawer Header with Banner */}
            <div className="relative h-48 shrink-0">
              <img src={styles.image} alt="Banner" className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: styles.hex }}>
                  Mission Documents
                </span>
                <h2 className="text-3xl font-black text-white capitalize">{mission.title}</h2>
              </div>
            </div>

            {/* Controls: Search and Filters */}
            <div className="px-6 py-4 border-b border-white/5 shrink-0 bg-[#0a0a0a]/90 backdrop-blur-lg sticky top-0 z-20">
              <div className="flex items-center gap-3 mb-4 w-full">
                <button 
                  onClick={onClose}
                  className="md:hidden p-2.5 -ml-2 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="relative flex-1 min-w-0">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search documents..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
                <button 
                  onClick={onClose}
                  className="hidden md:flex p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      activeFilter === filter 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50 pt-10">
                  <FileIcon size={48} className="mb-4 text-gray-500" />
                  <p className="text-lg font-bold text-white">No documents found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
                </div>
              ) : (
                filteredDocs.map((doc, idx) => {
                  const fileInfo = getFileTypeInfo(doc.name, doc.link);
                  const Icon = fileInfo.icon;
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-2xl transition-all overflow-hidden"
                    >
                      <div className={`p-3 rounded-xl shrink-0 ${fileInfo.bg} ${fileInfo.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 w-full min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate mb-1">{doc.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                          <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${fileInfo.bg} ${fileInfo.color}`}>
                            {fileInfo.type}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-none">
                        <a
                          href={doc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                        >
                          <Eye size={14} /> View
                        </a>
                        <a
                          href={getDownloadLink(doc.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                        >
                          <Download size={14} /> DL
                        </a>
                        
                        {isSuperAdmin && (
                          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
                            <button
                              onClick={() => onEdit(doc, mission.title)}
                              className="p-1.5 text-amber-400 hover:bg-amber-400/20 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(doc)}
                              className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Transparency = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const [addDocRows, setAddDocRows] = useState([{ name: "", link: "" }]);

  const existingCategories = useMemo(() => documents.map(d => d.title), [documents]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", category: "", link: "" });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const adminEmail = getAdminUser()?.email?.toLowerCase();
  const superAdminEmails = ["debashishparida75@gmail.com", "abhijeetduttaam2222@gmail.com", "abhijeetdashx@gmail.com", "fularanifoundation@gmail.com"];
  const isSuperAdmin = isAdminAuthenticated() && superAdminEmails.includes(adminEmail);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/documents");
      const data = response.data.data;
      
      const grouped = data.reduce((acc, doc) => {
        if (!acc[doc.category]) acc[doc.category] = [];
        acc[doc.category].push({ id: doc._id, name: doc.name, link: doc.link });
        return acc;
      }, {});

      const formattedData = Object.keys(grouped).map(key => ({
        title: key,
        documents: grouped[key]
      }));

      formattedData.sort((a, b) => a.title.localeCompare(b.title));
      setDocuments(formattedData);
      
      if (selectedMission) {
        const updated = formattedData.find(m => m.title === selectedMission.title);
        if (updated) setSelectedMission(updated);
        else setSelectedMission(null);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDocRowChange = (idx, field, value) => setAddDocRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  const addNewRow = () => setAddDocRows(prev => [...prev, { name: "", link: "" }]);
  const removeRow = (idx) => {
    if (addDocRows.length <= 1) return;
    setAddDocRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addCategory.trim()) return alert("Please enter a category.");
    const validRows = addDocRows.filter(r => r.name.trim() && r.link.trim());
    if (validRows.length === 0) return alert("Please fill in at least one document.");
    try {
      setIsSubmitting(true);
      for (const row of validRows) {
        await api.post("/api/documents", { name: row.name, link: row.link, category: addCategory.trim() });
      }
      setAddCategory("");
      setAddDocRows([{ name: "", link: "" }]);
      setIsModalOpen(false);
      await fetchDocuments();
    } catch (err) {
      console.error("Failed to add document(s):", err);
      alert("Failed to add document(s). Please check the inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (doc, category) => {
    setEditingDoc(doc);
    setEditFormData({ name: doc.name, category: category, link: doc.link });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.put(`/api/documents/${editingDoc.id}`, editFormData);
      setIsEditModalOpen(false);
      setEditingDoc(null);
      await fetchDocuments();
    } catch (err) {
      console.error("Failed to update document:", err);
      alert("Failed to update document. Please check the inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (doc) => {
    setDeletingDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/documents/${deletingDoc.id}`);
      setIsDeleteModalOpen(false);
      setDeletingDoc(null);
      await fetchDocuments();
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm font-semibold mb-6 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
              <ShieldCheck size={14} className="text-primary" />
              <span>100% Accountability</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Our Public <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Records</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Transparency is at the core of what we do. Browse our mission categories to access comprehensive financial and impact reports.
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
            >
              <Plus size={18} />
              Add Record
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-56 md:h-72 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-32 bg-white/[0.02] rounded-3xl border border-white/5">
            <p className="text-red-400 mb-6 text-lg">{error}</p>
            <button 
              onClick={fetchDocuments}
              className="px-8 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all font-bold"
            >
              Retry
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-32 border border-white/5 bg-white/[0.02] rounded-3xl">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No Records Found</h3>
            <p className="text-gray-400 max-w-md mx-auto text-lg">
              We are currently organizing our documents. They will be securely published here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {documents.map((mission, index) => (
              <MissionCard
                key={mission.title}
                mission={mission}
                index={index}
                onClick={setSelectedMission}
              />
            ))}
          </div>
        )}
      </div>

      <DocumentDrawer 
        mission={selectedMission} 
        isOpen={!!selectedMission} 
        onClose={() => setSelectedMission(null)}
        isSuperAdmin={isSuperAdmin}
        onEdit={openEditModal}
        onDelete={openDeleteConfirm}
      />

      {/* Add Document Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-white mb-2">Add New Record</h2>
                <p className="text-gray-400 text-sm">Organize documents under a mission category.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Mission Category</label>
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    placeholder="e.g. Project Gachha Chhai"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors"
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                  />
                  <datalist id="category-suggestions">
                    {existingCategories.map((cat) => <option key={cat} value={cat} />)}
                  </datalist>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-300">Documents</label>
                    <button
                      type="button"
                      onClick={addNewRow}
                      className="inline-flex items-center gap-1.5 text-xs text-white font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <PlusCircle size={14} /> Add Row
                    </button>
                  </div>

                  {addDocRows.map((row, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          required
                          placeholder={`Document Name (e.g. Annual Report 2024)`}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                          value={row.name}
                          onChange={(e) => handleDocRowChange(idx, "name", e.target.value)}
                        />
                        <input
                          type="url"
                          required
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                          value={row.link}
                          onChange={(e) => handleDocRowChange(idx, "link", e.target.value)}
                        />
                      </div>
                      {addDocRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(idx)}
                          className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                        >
                          <MinusCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Saving...</> : "Upload Documents"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Document Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative z-10"
            >
              <button
                onClick={() => { setIsEditModalOpen(false); setEditingDoc(null); }}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-2">Edit Record</h2>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Mission Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors"
                    value={editFormData.category}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Document Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Google Drive URL</label>
                  <input
                    type="url"
                    name="link"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors"
                    value={editFormData.link}
                    onChange={handleEditInputChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative z-10 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} className="text-red-500" />
              </div>

              <h2 className="text-2xl font-black text-white mb-3">Delete Record</h2>
              <p className="text-gray-400 text-sm mb-8">
                Are you sure you want to delete <span className="text-white font-semibold">"{deletingDoc?.name}"</span>? This action is permanent.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setDeletingDoc(null); }}
                  className="flex-1 py-3.5 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transparency;
