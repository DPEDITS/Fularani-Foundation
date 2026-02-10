import React from "react";
import { motion as Motion } from "motion/react";
import { X, Image as ImageIcon } from "lucide-react";

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
    if (!isOpen) return null;

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
                        onClick={onClose}
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
    );
};

export default GalleryUploadModal;
