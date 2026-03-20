import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";

const GalleryUploadModal = ({
    isOpen,
    onClose,
    editingItem,
    uploadFormData,
    setUploadFormData,
    handleInputChange,
    handleFileChange,
    handleUploadSubmit,
    isUploading,
    categories,
}) => {
    // Determine initial mode based on whether an image link already exists
    const [uploadMode, setUploadMode] = useState(uploadFormData.imageLink ? "link" : "file");

    if (!isOpen) return null;

    const handleModeSwitch = (mode) => {
        setUploadMode(mode);
        // Clear the other source when switching
        if (mode === "file") {
            setUploadFormData(prev => ({ ...prev, imageLink: "" }));
        } else {
            setUploadFormData(prev => ({ ...prev, imageUrl: null }));
        }
    };

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/60 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={onClose}
        >
            <Motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border-2 border-secondary/5 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-12 pb-8 flex justify-between items-center">
                    <div>
                        <h3 className="text-4xl font-black tracking-tighter lowercase leading-none">
                            {editingItem ? "Refine story" : "new chronicle."}
                        </h3>
                        <p className="text-secondary/40 font-bold uppercase text-[10px] tracking-widest mt-2">
                            Shaping history, one frame at a time.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 rounded-full bg-muted/30 text-secondary hover:bg-secondary hover:text-white transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Upload Mode Switcher */}
                <div className="px-12 mb-6">
                    <div className="flex bg-muted/20 p-1.5 rounded-2xl gap-2 w-fit">
                        <button
                            type="button"
                            onClick={() => handleModeSwitch("file")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${uploadMode === "file" ? "bg-white text-secondary shadow-sm" : "text-secondary/40 hover:text-secondary"}`}
                        >
                            <Upload size={14} /> File Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeSwitch("link")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${uploadMode === "link" ? "bg-white text-secondary shadow-sm" : "text-secondary/40 hover:text-secondary"}`}
                        >
                            <LinkIcon size={14} /> Direct Link
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleUploadSubmit}
                    className="px-12 pb-12 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar"
                >
                    <div className="space-y-8">
                        {/* Title & Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                <div className="relative">
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
                        </div>

                        {/* Visual Source Input */}
                        <AnimatePresence mode="wait">
                            {uploadMode === "file" ? (
                                <Motion.div
                                    key="file"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="relative group"
                                >
                                    <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-3 block ml-1">
                                        Visual File
                                    </label>
                                    <div className="h-40 rounded-3xl bg-muted/20 border-2 border-dashed border-secondary/10 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            required={!editingItem && uploadMode === "file"}
                                        />
                                        <div className="p-4 rounded-2xl bg-white/50 mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="text-primary" size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-secondary/40 px-6 text-center">
                                            {uploadFormData.imageUrl ? uploadFormData.imageUrl.name : "Select photo from device"}
                                        </span>
                                    </div>
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    key="link"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-3 block ml-1">
                                            Visual Link (Cloudinary, Drive, etc.)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20">
                                                <LinkIcon size={20} />
                                            </div>
                                            <input
                                                type="url"
                                                name="imageLink"
                                                value={uploadFormData.imageLink}
                                                onChange={handleInputChange}
                                                className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-lg placeholder:text-gray-300"
                                                placeholder="https://example.com/image.jpg"
                                                required={uploadMode === "link"}
                                            />
                                        </div>
                                    </div>
                                    {uploadFormData.imageLink && (
                                        <div className="h-32 rounded-2xl overflow-hidden bg-muted/10 border border-secondary/5 relative">
                                            <img 
                                                src={uploadFormData.imageLink} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/600x400?text=Invalid+Image+Link";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Link Preview</span>
                                            </div>
                                        </div>
                                    )}
                                </Motion.div>
                            )}
                        </AnimatePresence>

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
                                placeholder="What happened in this moment? (Optional)"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full h-20 bg-primary text-white rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                    >
                        {isUploading ? (
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {editingItem ? "Update Story" : "Publish Moment"}
                                <ImageIcon size={20} />
                            </>
                        )}
                    </button>
                    <p className="text-center text-[9px] font-bold text-secondary/20 uppercase tracking-[0.3em]">
                        Your moments are preserved in our eternal digital archive.
                    </p>
                </form>
            </Motion.div>
        </Motion.div>
    );
};

export default GalleryUploadModal;

