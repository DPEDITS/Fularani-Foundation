import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Eye, ShieldCheck, ChevronDown, Plus, X, Loader2, Pencil, Trash2, PlusCircle, MinusCircle } from "lucide-react";
import api from "../services/api";
import { isAdminAuthenticated, getAdminUser } from "../services/adminService";
const getDownloadLink = (url) => {
  if (!url) return "#";
  try {
    // Robust regex to extract ID from various Drive URL formats
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})\b/) || url.match(/id=([a-zA-Z0-9_-]{25,})\b/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
  } catch (err) {
    return url;
  }
};

const SubtopicSection = ({ subtopic, index, isSuperAdmin, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-sm mb-6"
    >
      <div 
        className="p-5 md:p-6 flex justify-between items-center cursor-pointer hover:bg-white/[0.04] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold shrink-0 border border-primary/20">
            {index + 1}
          </span>
          <span className="capitalize">{subtopic.title}</span>
        </h2>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3 }}
          className="text-gray-400 p-2 bg-white/5 rounded-full"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 border-t border-white/5">
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-bold bg-white/[0.01]">
                      <th className="py-4 px-2 md:px-4 w-1/2 rounded-tl-lg">Document Name</th>
                      <th className="py-4 px-2 md:px-4 text-right rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtopic.documents.map((doc, docIdx) => (
                      <tr 
                        key={doc.id} 
                        className={`transition-colors group hover:bg-white/[0.03] cursor-pointer ${
                          docIdx !== subtopic.documents.length - 1 ? "border-b border-white/5" : ""
                        }`}
                        onClick={() => window.open(doc.link, "_blank")}
                        title="Click to View Document"
                      >
                        <td className="py-4 px-2 md:px-4">
                          <div className="flex items-center gap-2 md:gap-3 text-gray-300 font-medium overflow-hidden">
                            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg text-primary/70 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                <FileText size={16} className="md:w-[18px] md:h-[18px]" />
                            </div>
                            <span className="truncate text-xs md:text-sm">{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 md:px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 md:gap-2">
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-primary text-white text-[10px] md:text-sm font-semibold rounded-lg transition-all border border-white/10 hover:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye size={14} className="md:w-[16px] md:h-[16px]" />
                              <span className="hidden sm:inline">View</span>
                            </a>
                            {isSuperAdmin && (
                              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => onEdit(doc, subtopic.title)}
                                  className="p-1.5 md:p-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white rounded-lg transition-all border border-amber-500/20 hover:border-transparent"
                                  title="Edit"
                                >
                                  <Pencil size={12} className="md:w-[14px] md:h-[14px]" />
                                </button>
                                <button
                                  onClick={() => onDelete(doc)}
                                  className="p-1.5 md:p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/20 hover:border-transparent"
                                  title="Delete"
                                >
                                  <Trash2 size={12} className="md:w-[14px] md:h-[14px]" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Transparency = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const [addDocRows, setAddDocRows] = useState([{ name: "", link: "" }]);

  // Derive unique existing categories for auto-suggest
  const existingCategories = useMemo(() => documents.map(d => d.title), [documents]);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", category: "", link: "" });

  // Delete confirm
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const adminEmail = getAdminUser()?.email?.toLowerCase();
  const superAdminEmails = ["debashishparida75@gmail.com", "abhijeetduttaam2222@gmail.com"];
  const isSuperAdmin = isAdminAuthenticated() && superAdminEmails.includes(adminEmail);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/documents");
      const data = response.data.data;
      
      const grouped = data.reduce((acc, doc) => {
        if (!acc[doc.category]) {
          acc[doc.category] = [];
        }
        acc[doc.category].push({ id: doc._id, name: doc.name, link: doc.link });
        return acc;
      }, {});

      const formattedData = Object.keys(grouped).map(key => ({
        title: key,
        documents: grouped[key]
      }));

      formattedData.sort((a, b) => a.title.localeCompare(b.title));
      setDocuments(formattedData);
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

  // --- Add Document (multi-row) ---
  const handleDocRowChange = (idx, field, value) => {
    setAddDocRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const addNewRow = () => {
    setAddDocRows(prev => [...prev, { name: "", link: "" }]);
  };

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
      // POST each document individually — backend handles category normalization
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

  // --- Edit Document ---
  const openEditModal = (doc, category) => {
    setEditingDoc(doc);
    setEditFormData({ name: doc.name, category: category, link: doc.link });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

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

  // --- Delete Document ---
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
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          {isSuperAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="md:absolute right-0 top-0 mb-6 md:mb-0 inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/50 text-sm font-bold rounded-lg transition-all shadow-lg"
            >
              <Plus size={16} />
              Add New Document
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <ShieldCheck size={18} />
            <span>100% Accountability</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Our Public <span className="text-primary">Records</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every impact is backed by transparency. Browse through our project subtopics below to view and download relevant financial records, receipts, and audit reports.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchDocuments}
              className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-white/[0.02] rounded-3xl">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Documents Yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Our public records are currently being compiled and will be available here soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((subtopic, index) => (
              <SubtopicSection
                key={subtopic.title}
                subtopic={subtopic}
                index={index}
                isSuperAdmin={isSuperAdmin}
                onEdit={openEditModal}
                onDelete={openDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== Add Document Modal (multi-row) ===== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-black text-white mb-2">Add Documents</h2>
                <p className="text-gray-400 text-sm">Add one or more documents under the same mission. Matching an existing category merges them automatically.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category field with datalist */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Mission Name / Category</label>
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    placeholder="e.g. Project Gachha Chhai"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                  />
                  <datalist id="category-suggestions">
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                  {/* Show hint if this matches an existing category */}
                  {addCategory.trim() && existingCategories.some(c => c.toLowerCase() === addCategory.trim().toLowerCase()) && (
                    <p className="text-xs text-primary mt-1.5 font-medium">✓ Documents will be added to the existing "{existingCategories.find(c => c.toLowerCase() === addCategory.trim().toLowerCase())}" category.</p>
                  )}
                </div>

                {/* Dynamic document rows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-300">Documents</label>
                    <button
                      type="button"
                      onClick={addNewRow}
                      className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:text-white transition-colors"
                    >
                      <PlusCircle size={14} />
                      Add another
                    </button>
                  </div>

                  {addDocRows.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          required
                          placeholder={`Document name ${idx + 1}`}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                          value={row.name}
                          onChange={(e) => handleDocRowChange(idx, "name", e.target.value)}
                        />
                        <input
                          type="url"
                          required
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                          value={row.link}
                          onChange={(e) => handleDocRowChange(idx, "link", e.target.value)}
                        />
                      </div>
                      {addDocRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(idx)}
                          className="mt-2 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                          title="Remove this document"
                        >
                          <MinusCircle size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving {addDocRows.filter(r => r.name && r.link).length} document(s)...
                    </>
                  ) : (
                    `Save ${addDocRows.filter(r => r.name && r.link).length || ""} Document${addDocRows.filter(r => r.name && r.link).length > 1 ? "s" : ""}`
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== Edit Document Modal ===== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-amber-500/20 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => { setIsEditModalOpen(false); setEditingDoc(null); }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
                  <Pencil size={12} />
                  <span>Editing</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Update Document</h2>
                <p className="text-gray-400 text-sm">Edit the details of this public record.</p>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Mission Name / Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    placeholder="e.g. Project Gachha Chhai"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    value={editFormData.category}
                    onChange={handleEditInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Document Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Audit Report 2025"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Google Drive URL</label>
                  <input
                    type="url"
                    name="link"
                    required
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    value={editFormData.link}
                    onChange={handleEditInputChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Document"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== Delete Confirmation Modal ===== */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-red-500/20 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/20">
                <Trash2 size={24} className="text-red-400" />
              </div>

              <h2 className="text-xl font-black text-white mb-2">Delete Document?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to permanently delete <span className="text-white font-semibold">"{deletingDoc?.name}"</span>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setDeletingDoc(null); }}
                  className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
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
