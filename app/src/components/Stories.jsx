import React, { useRef } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import storyBg from "../assets/missions1.jpeg";

const stories = [
  {
    category: "Education",
    title: "ranjeeta's vision.",
    description:
      "How one scholarship and a digital tablet changed an entire family's economic path in rural Odisha.",
    image: storyBg,
    author: "Primary Donor: Tech4Impact",
  },
  {
    category: "Sustainability",
    title: "the green village.",
    description:
      "Transforming 50 acres of barren land into a thriving, income-generating ecosystem for local farmers.",
    image: storyBg,
    author: "Project Lead: Mission Green",
  },
  {
    category: "Health",
    title: "access to dignity.",
    description:
      "Providing specialized wheelchairs and home-care support to 200+ individuals with mobility challenges.",
    image: storyBg,
    author: "Foundation Healthcare",
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
    <section className="py-24 md:py-32 bg-muted/30 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-secondary mb-4">
              Testimonials
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-none lowercase">
              voice of <br />
              <span className="text-white bg-primary px-4 py-1 inline-block rotate-1">
                the field.
              </span>
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-xl border-2 border-secondary/10 flex items-center justify-center hover:bg-primary transition-all group"
            >
              <ArrowLeft
                size={24}
                className="group-active:scale-90 transition-transform"
              />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-xl bg-secondary text-white flex items-center justify-center hover:bg-accent transition-all group shadow-xl shadow-secondary/20"
            >
              <ArrowRight
                size={24}
                className="group-active:scale-95 transition-transform"
              />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
        >
          {stories.map((story, index) => (
            <div
              key={index}
              className="min-w-[320px] md:min-w-[500px] snap-start bg-white shadow-2xl overflow-hidden group border border-secondary/5"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider text-white">
                    {story.category}
                  </div>
                </div>

                <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <Quote size={40} className="text-primary mb-6 opacity-40" />
                    <h3 className="text-3xl font-black text-secondary mb-4 tracking-tighter leading-none">
                      {story.title}
                    </h3>
                    <p className="text-muted-foreground font-bold text-lg leading-tight mb-8">
                      "{story.description}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-muted">
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 whitespace-nowrap">
                      {story.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;
