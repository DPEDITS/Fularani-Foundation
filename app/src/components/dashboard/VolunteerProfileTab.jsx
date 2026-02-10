import React from "react";
import { User, Mail, Phone, MapPin, FileText, Wrench, Target, Sparkles, Camera } from "lucide-react";

const VolunteerProfileTab = ({ profile, user, handleLogout }) => {
    const data = profile || user;
    const skillsList = typeof data?.skills === 'string' ? data.skills.split(',') : (Array.isArray(data?.skills) ? data.skills : []);
    const areasList = typeof data?.preferredAreas === 'string' ? data.preferredAreas.split(',') : (Array.isArray(data?.preferredAreas) ? data.preferredAreas : []);

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Details Card */}
                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-secondary/10">
                    <h3 className="text-xl font-black text-secondary mb-8 lowercase tracking-tighter">contact information.</h3>
                    <div className="space-y-6">
                        <ProfileRow icon={User} label="Full Name" value={data?.username} />
                        <ProfileRow icon={Mail} label="Email" value={data?.email} />
                        <ProfileRow icon={Phone} label="Phone" value={data?.phone} />
                        <ProfileRow icon={MapPin} label="Location" value={data?.address} />
                    </div>
                </div>

                {/* Identity & Skills Card */}
                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-secondary/10">
                    <h3 className="text-xl font-black text-secondary mb-8 lowercase tracking-tighter">identity & expertise.</h3>
                    <div className="space-y-8">
                        <ProfileRow icon={FileText} label={`${data?.idType || 'ID'}`} value={data?.panNumber ? `•••• •••• ${data.panNumber.slice(-4)}` : 'N/A'} />

                        <div>
                            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Wrench size={14} /> Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {skillsList.length > 0 ? skillsList.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-muted text-secondary text-[10px] font-black uppercase tracking-widest rounded-sm border border-secondary/5">{skill.trim()}</span>
                                )) : <span className="text-secondary/40 text-[10px] font-black uppercase">None listed</span>}
                            </div>
                        </div>

                        <div>
                            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Target size={14} /> Preferred Areas
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {areasList.length > 0 ? areasList.map((area, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-accent/20 text-secondary text-[10px] font-black uppercase tracking-widest rounded-sm border border-accent/20">{area.trim()}</span>
                                )) : <span className="text-secondary/40 text-[10px] font-black uppercase">None selected</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Motivation Section */}
            <div className="bg-secondary p-8 md:p-12 rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Sparkles size={18} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-black text-white lowercase tracking-tighter">your motivation.</h3>
                    </div>
                    <p className="text-white text-xl md:text-2xl font-black leading-tight italic text-center max-w-2xl mx-auto">
                        "{data?.motivation || "I want to help the community and make a positive impact through Fularani Foundation."}"
                    </p>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-muted/30 rounded-[32px] gap-6 border border-secondary/5">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-secondary font-black text-xl border border-secondary/5">
                        {data?.impactLevel || '1'}
                    </div>
                    <div>
                        <p className="text-secondary font-black tracking-tight">Impact Level {data?.impactLevel || '1'}</p>
                        <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">Rising Star Volunteer • Member since {data?.createdAt ? new Date(data.createdAt).getFullYear() : '2024'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-white border border-secondary/10 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-muted transition-all flex items-center gap-2">
                        <Camera size={14} /> Update Avatar
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
                    >
                        Logout Account
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-5">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Icon size={18} className="text-secondary/60" />
        </div>
        <div>
            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-secondary font-black text-lg tracking-tight">{value || "—"}</p>
        </div>
    </div>
);

export default VolunteerProfileTab;
