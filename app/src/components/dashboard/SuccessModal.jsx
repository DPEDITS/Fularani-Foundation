import React from "react";
import { Check, Sparkles } from "lucide-react";

const SuccessModal = ({ show, onClose, amount, formatCurrency }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-center relative overflow-hidden">
                {/* Animated background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10">
                    {/* Success Icon with Animation */}
                    <div className="relative mx-auto w-20 h-20 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-ping opacity-20"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                            <Check size={36} className="text-white" strokeWidth={3} />
                        </div>
                        {/* Sparkles */}
                        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                        <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-yellow-400 animate-bounce delay-100" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">
                        Thank You! 🎉
                    </h2>
                    <p className="text-[#86868b] mb-6">
                        Your donation was successful
                    </p>

                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-6 border border-rose-100">
                        <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">
                            Amount Donated
                        </p>
                        <p className="text-4xl font-bold text-[#1d1d1f]">
                            {formatCurrency(amount)}
                        </p>
                    </div>

                    <p className="text-sm text-[#86868b] mb-8 leading-relaxed">
                        Your generosity will make a real difference in someone's life. A
                        receipt has been sent to your email.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
