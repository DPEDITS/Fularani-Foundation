import { ArrowRight } from "lucide-react";
import GalleryCarousel from "./GalleryCarousel";

const HomeGallery = () => {
    return (
        <section className="py-24 bg-white" id="gallery-preview">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-[600px]">
                        <span className="text-blue-600 font-semibold text-sm mb-4 tracking-tight uppercase px-4 py-1.5 bg-blue-50 rounded-full inline-block">
                            Moments of Impact
                        </span>
                        <h2 className="text-[36px] md:text-[48px] font-bold text-[#1d1d1f] leading-[1.1]">
                            Witness Our Journey
                        </h2>
                    </div>
                    <a
                        href="/gallery"
                        className="text-[#0066cc] text-[17px] font-medium hover:underline flex items-center gap-1 group whitespace-nowrap"
                    >
                        Visit full gallery <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="relative">
                    <GalleryCarousel />
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#f5f5f7] p-8 rounded-[2rem] text-center">
                        <div className="text-[32px] font-bold text-[#1d1d1f] mb-1">500+</div>
                        <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Volunteers</div>
                    </div>
                    <div className="bg-[#f5f5f7] p-8 rounded-[2rem] text-center">
                        <div className="text-[32px] font-bold text-[#1d1d1f] mb-1">1000+</div>
                        <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Donors</div>
                    </div>
                    <div className="bg-[#f5f5f7] p-8 rounded-[2rem] text-center">
                        <div className="text-[32px] font-bold text-[#1d1d1f] mb-1">50k+</div>
                        <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Lives Impacted</div>
                    </div>
                    <div className="bg-[#f5f5f7] p-8 rounded-[2rem] text-center">
                        <div className="text-[32px] font-bold text-[#1d1d1f] mb-1">10+</div>
                        <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Awards</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeGallery;
