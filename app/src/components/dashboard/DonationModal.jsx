import React from "react";
import { X } from "lucide-react";

const DonationModal = ({ show, onClose, onDonate }) => {
    const [customAmount, setCustomAmount] = React.useState("");

    if (!show) return null;

    const handleCustomSubmit = () => {
        if (customAmount && parseFloat(customAmount) > 0) {
            onDonate(customAmount, false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[32px] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">
                        Make a Donation
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-3 block">
                            Select Amount (INR)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[500, 1000, 2000, 5000, 10000].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => onDonate(amt, false)}
                                    className="py-3 px-2 rounded-xl border border-black/5 bg-[#f5f5f7] hover:bg-rose-50 hover:border-rose-200 text-[#1d1d1f] font-bold text-sm transition-all active:scale-95"
                                >
                                    ₹{amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-black/5">
                        <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2 block">
                            Or Enter Custom Amount
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f] font-bold">₹</span>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full py-4 pl-8 pr-4 rounded-xl border border-black/5 bg-[#f5f5f7] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCustomSubmit();
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleCustomSubmit}
                                disabled={!customAmount}
                                className="px-6 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Donate
                            </button>
                        </div>
                    </div>

                    <p className="text-[11px] text-[#86868b] text-center leading-relaxed">
                        Your contribution goes directly towards our mission.
                        Transactions are secured by Razorpay.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
