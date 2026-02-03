import React, { useRef } from "react";
import { cn } from "../utils/cn";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import storyBg from "../assets/missions1.jpeg"; // Reusing for placeholder

const stories = [
  {
    category: "Education",
    title: "Ranjeeta's Vision",
    description: "How one scholarship changed an entire family's future.",
    image: storyBg,
  },
  {
    category: "Sustainability",
    title: "The Green Village",
    description: "Transforming barren land into a thriving ecosystem.",
    image: storyBg,
  },
  {
    category: "Health",
    title: "Mobility for All",
    description: "Providing dignity through accessibility.",
    image: storyBg,
  },
  {
    category: "Volunteer",
    title: "A Day in Life",
    description: "Experience the joy of giving back.",
    image: storyBg,
  },
];

const Stories = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-20 bg-[#f5f5f7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">
              Stories of Change
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl">
              Real people, real impact. See how we are making a difference.
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-gray-300 hover:bg-white hover:border-gray-400 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-gray-300 hover:bg-white hover:border-gray-400 transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stories.map((story, index) => (
            <div
              key={index}
              className="min-w-[300px] md:min-w-[400px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-black/5"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800">
                  {story.category}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                  {story.description}
                </p>
                <span className="inline-flex items-center text-blue-600 font-semibold text-sm group/link">
                  Read Story{" "}
                  <ArrowUpRight
                    size={16}
                    className="ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;
