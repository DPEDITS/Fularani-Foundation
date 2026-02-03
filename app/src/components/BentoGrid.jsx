import React from "react";
import { cn } from "../utils/cn";
import { ArrowUpRight } from "lucide-react";
import missionsBg from "../assets/missions1.jpeg";

const BentoGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">
            Focus Areas
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl">
            Our targeted missions designed to create systemic change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Card 1: Mission Education (Large) */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl bg-gray-100">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              style={{ backgroundImage: `url(${missionsBg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-10">
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-2 block">
                Mission Education
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Empowering the Next Generation
              </h3>
              <p className="text-gray-200 text-lg mb-6 max-w-md line-clamp-2">
                Providing quality education and resources to underprivileged
                children in rural Odisha.
              </p>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full p-3 hover:bg-white hover:text-black transition-all">
                <ArrowUpRight size={24} />
              </button>
            </div>
          </div>

          {/* Card 2: Mission Green (Tall) */}
          <div className="relative group overflow-hidden rounded-3xl bg-[#dcfce7] md:col-span-1 md:row-span-1 border border-black/5">
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                  Mission Green
                </span>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">
                  Sustainable Future
                </h3>
              </div>
              <div className="flex justify-end">
                <div className="w-24 h-24 bg-green-500 rounded-full blur-2xl opacity-20 absolute bottom-10 right-10 group-hover:opacity-40 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Card 3: Mission Mobility (Small) */}
          <div className="relative group overflow-hidden rounded-3xl bg-blue-50 md:col-span-1 md:row-span-1 border border-black/5">
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                  Mission Mobility
                </span>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">
                  Access for All
                </h3>
              </div>
              <div className="flex justify-end mt-4">
                {/* Placeholder icon/graphic */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
