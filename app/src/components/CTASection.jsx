import { ArrowRight, Heart, Users } from "lucide-react";

const CTASection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Volunteer CTA */}
                    <div className="relative overflow-hidden rounded-[3rem] bg-[#1d1d1f] p-12 lg:p-16 flex flex-col items-start justify-between min-h-[450px] group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Users size={200} className="text-white" />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[#a1a1a6] font-semibold text-sm mb-4 tracking-tight uppercase">Join the Movement</span>
                            <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-6 max-w-[300px]">
                                Become a Volunteer
                            </h2>
                            <p className="text-[#a1a1a6] text-[17px] md:text-[19px] leading-relaxed mb-8 max-w-[350px]">
                                Your time and skills can change lives. Join our community of dedicated change-makers.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = "/volunteer-register"}
                            className="relative z-10 bg-white text-[#1d1d1f] px-8 py-3 rounded-full text-[17px] font-semibold hover:bg-[#f5f5f7] transition-all flex items-center gap-2 group/btn"
                        >
                            Apply Now <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Donor CTA */}
                    <div className="relative overflow-hidden rounded-[3rem] bg-[#f5f5f7] p-12 lg:p-16 flex flex-col items-start justify-between min-h-[450px] group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700 text-[#0071e3]">
                            <Heart size={200} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[#86868b] font-semibold text-sm mb-4 tracking-tight uppercase">Support Our Cause</span>
                            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] leading-tight mb-6 max-w-[300px]">
                                Make a Donation
                            </h2>
                            <p className="text-[#86868b] text-[17px] md:text-[19px] leading-relaxed mb-8 max-w-[350px]">
                                Help us reach more people and expand our impact with your generous contribution.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = "/donor-register"}
                            className="relative z-10 bg-[#0071e3] text-white px-8 py-3 rounded-full text-[17px] font-semibold hover:bg-[#0077ed] transition-all flex items-center gap-2 group/btn shadow-lg shadow-blue-500/20"
                        >
                            Donate Now <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
