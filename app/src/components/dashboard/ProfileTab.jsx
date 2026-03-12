import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, FileText, Edit2, Check, ShieldCheck } from "lucide-react";

const ProfileField = ({
    icon: Icon,
    label,
    value,
    isEditing,
    onChange,
    type = "text",
    placeholder,
    isReadOnly = false,
}) => (
    <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Icon size={20} className="text-secondary/60" />
        </div>
        <div className="flex-1">
            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
            {isEditing && !isReadOnly ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-muted/50 border-2 border-transparent focus:border-primary rounded-lg px-4 py-2 text-base font-bold text-secondary focus:outline-none transition-colors"
                />
            ) : (
                <div className="flex items-center gap-2">
                    <p className={`text-secondary font-black text-lg min-h-[28px] ${isReadOnly && isEditing ? "opacity-50" : ""}`}>
                        {value || "—"}
                    </p>
                    {isReadOnly && isEditing && (
                        <ShieldCheck size={16} className="text-green-500" title="Verified & Immutable" />
                    )}
                </div>
            )}
        </div>
    </div>
);

const ProfileTab = ({ user, onUpdate, isUpdating }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        phone: user?.phone || "",
        address: user?.address || "",
        panNumber: user?.panNumber || "",
        wants80GReceipt: user?.wants80GReceipt || false,
    });

    // Sync form data when user prop changes (after successful update)
    useEffect(() => {
        if (user && !isEditing) {
            setFormData({
                username: user.username || "",
                phone: user.phone || "",
                address: user.address || "",
                panNumber: user.panNumber || "",
                wants80GReceipt: !!user.wants80GReceipt,
            });
        }
    }, [user, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(formData);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Update error:", err);
            const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
            alert(errorMessage);
        }
    };

    return (
        <div className="space-y-6 relative">
            {showSuccess && (
                <div className="fixed top-32 right-10 z-[110] bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500 border border-white/20">
                    <div className="bg-green-500 rounded-full p-1"><Check size={14} className="text-white" /></div>
                    <p className="font-black text-xs uppercase tracking-widest">Profile updated</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 md:p-8 bg-secondary rounded-[32px] shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 shrink-0 flex items-center justify-center backdrop-blur-sm">
                        <User size={24} className="text-white/80" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter mb-1">identity settings.</h3>
                        <p className="text-white/60 text-xs font-bold">Manage your personal information and preferences.</p>
                    </div>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-secondary font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all relative z-10"
                    >
                        <Edit2 size={14} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-3 relative z-10">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-5 py-3 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-secondary font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-accent/20"
                        >
                            {isUpdating ? "Saving..." : <><Check size={14} /> Save</>}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-secondary/10">
                    <h3 className="text-xl font-black text-secondary mb-6 lowercase tracking-tighter">contact information.</h3>
                    <div className="space-y-6">
                        <ProfileField
                            icon={User}
                            label="Username"
                            name="username"
                            value={formData.username}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, username: val })}
                        />
                        <ProfileField
                            icon={Phone}
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            isEditing={isEditing}
                            type="tel"
                            onChange={(val) => setFormData({ ...formData, phone: val })}
                        />
                        <ProfileField
                            icon={MapPin}
                            label="Address"
                            name="address"
                            value={formData.address}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, address: val })}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-secondary/10">
                    <h3 className="text-xl font-black text-secondary mb-6 lowercase tracking-tighter">fiscal identity.</h3>
                    <div className="space-y-6">
                        <ProfileField
                            icon={FileText}
                            label="PAN Number"
                            name="panNumber"
                            value={formData.panNumber}
                            isEditing={isEditing}
                            isReadOnly={user?.panNumber && user?.panNumber !== "PENDING" && user?.panVerified}
                            placeholder="ABCDE1234F"
                            onChange={(val) => setFormData({ ...formData, panNumber: val })}
                        />

                        <div className="pt-4 mt-2 border-t border-secondary/10">
                            <label className="flex items-start gap-4 cursor-pointer group select-none">
                                <div className="relative flex items-center pt-1">
                                    <input
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={formData.wants80GReceipt}
                                        onChange={(e) =>
                                            isEditing &&
                                            setFormData({
                                                ...formData,
                                                wants80GReceipt: e.target.checked,
                                            })
                                        }
                                        disabled={!isEditing}
                                    />
                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${formData.wants80GReceipt ? 'bg-primary border-primary' : 'bg-transparent border-secondary/20 group-hover:border-primary'}`}>
                                        {formData.wants80GReceipt && <Check size={14} className="text-white" />}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-secondary font-black text-xs uppercase tracking-tight">Automated 80G Receipts</p>
                                    <p className="text-secondary/60 text-[10px] font-bold leading-relaxed mt-1">Receive tax exemption certificates automatically in your email after every donation.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fiscal Benefit Card */}
            <div className="p-6 md:p-8 bg-primary/10 rounded-[32px] border border-primary/20">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-black text-secondary mb-1 uppercase tracking-tight">Tax Benefits (Sec 80G)</h4>
                        <p className="text-secondary/70 text-xs font-bold leading-relaxed max-w-3xl">
                            All your donations to Fularani Foundation are 50% tax-exempt under Section 80G of the Income Tax Act. Ensure your PAN is updated to receive accurate receipts.
                        </p>
                    </div>
                    <a href="/about" className="px-6 py-3 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/10 hover:-translate-y-1 transition-transform">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
