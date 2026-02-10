import React from "react";
import { X, Check } from "lucide-react";

const Toast = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div
            className={`fixed top-24 right-8 z-[110] px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-500 max-w-sm ${message.type === "error"
                    ? "bg-red-500 text-white shadow-red-500/20"
                    : "bg-green-500 text-white shadow-green-500/20"
                }`}
        >
            <div className="bg-white/20 p-1.5 rounded-full shrink-0">
                {message.type === "error" ? <X size={16} /> : <Check size={16} />}
            </div>
            <p className="font-medium text-sm">{message.text}</p>
            <button
                onClick={onClose}
                className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors shrink-0"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
