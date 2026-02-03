import { ArrowRight } from "lucide-react";

const HomeAbout = () => {
    return (
        <section className="py-24 bg-[#fbfbfd]" id="about-preview">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="relative">
                            <div className="w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Fularani Foundation Activities"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl hidden md:block">
                                <div className="text-[48px] font-bold text-[#0071e3] leading-none mb-1">10+</div>
                                <div className="text-[14px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-3">Professional Projects</div>
                                <p className="text-[13px] text-[#86868b] leading-tight">
                                    Successfully impacting thousands of lives across the region.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <span className="text-orange-600 font-semibold text-sm mb-4 tracking-tight uppercase px-4 py-1.5 bg-orange-50 rounded-full inline-block">
                            Our Story
                        </span>
                        <h2 className="text-[36px] md:text-[48px] font-bold text-[#1d1d1f] leading-[1.1] mb-6">
                            Who is Fularani Foundation?
                        </h2>
                        <p className="text-[19px] text-[#86868b] leading-relaxed mb-8 font-medium">
                            We are a non-profit organization dedicated to serving humanity. Our essence lies in the belief that everyone deserves a life of dignity, health, and opportunity.
                        </p>
                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4">
                                <div className="w-1.5 h-auto bg-orange-500 rounded-full"></div>
                                <p className="text-[17px] text-[#424245] leading-relaxed">
                                    Driven by the spirit of selfless service, we work on the ground to provide healthcare, education, and environmental support to those who need it most.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-auto bg-blue-500 rounded-full"></div>
                                <p className="text-[17px] text-[#424245] leading-relaxed">
                                    Our foundation is built on transparency, compassion, and a relentless commitment to positive social transformation.
                                </p>
                            </div>
                        </div>
                        <a
                            href="/about"
                            className="inline-flex items-center gap-2 bg-[#1d1d1f] text-white px-8 py-3.5 rounded-full text-[17px] font-medium hover:bg-[#000000] transition-all shadow-lg hover:shadow-xl group"
                        >
                            Read full story <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeAbout;
