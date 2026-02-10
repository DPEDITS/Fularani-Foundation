import React from "react";
import { motion as Motion } from "motion/react";
import { X, ArrowRight } from "lucide-react";

const GalleryDetailModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-secondary/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={onClose}
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
                        src={item.src}
                        alt={item.title}
                        className="max-h-[80vh] w-full object-contain"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-4 rounded-full bg-white text-secondary shadow-2xl lg:hidden"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="w-full lg:w-[450px] p-12 md:p-16 flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {item.category}
                        </span>
                        <button
                            onClick={onClose}
                            className="hidden lg:block text-secondary/20 hover:text-secondary transition-colors"
                        >
                            <X size={32} />
                        </button>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-5xl font-black tracking-tighter leading-[0.8] mb-12 lowercase">
                            {item.title}
                        </h2>

                        <div className="space-y-12">
                            <div>
                                <h4 className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-4">
                                    The Story
                                </h4>
                                <p className="text-xl text-secondary font-bold leading-tight">
                                    {item.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-secondary/5">
                                <div>
                                    <div className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-2">
                                        Source
                                    </div>
                                    <p className="font-black text-lg lowercase tracking-tight">
                                        {item.uploadedBy}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-2">
                                        Date
                                    </div>
                                    <p className="font-black text-lg lowercase tracking-tight">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Present"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <button
                            onClick={() => {
                                window.location.href = "/donor-register";
                                onClose();
                            }}
                            className="w-full h-20 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Support This Mission <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </Motion.div>
        </Motion.div>
    );
};

export default GalleryDetailModal;
