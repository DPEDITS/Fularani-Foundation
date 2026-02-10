import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react";
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
  const [selectedStory, setSelectedStory] = useState(null);

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

  const openStory = (story) => {
    setSelectedStory(story);
    document.body.style.overflow = "hidden";
  };

  const closeStory = () => {
    setSelectedStory(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="py-12 md:py-32 bg-muted/30 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-xl">
            <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[15px] font-black uppercase tracking-widest text-secondary mb-4">
              Testimonials
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-none lowercase">
              voice of <br />
              <span className="text-white bg-primary px-2 md:px-4 py-1 inline-block rotate-1">
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
              onClick={() => openStory(story)}
              className="min-w-[280px] md:min-w-[500px] snap-start bg-white shadow-2xl overflow-hidden group border border-secondary/5 cursor-pointer hover:shadow-3xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider text-white">
                    {story.category}
                    
                  </div>
                </div>

                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-between">
                  <div>
                    <Quote
                      size={32}
                      className="text-primary mb-4 md:mb-6 opacity-40"
                    />
                    <h3 className="text-2xl md:text-3xl font-black text-secondary mb-3 md:mb-4 tracking-tighter leading-none">
                      {story.title}
                    </h3>
                    <p className="text-muted-foreground font-bold text-base md:text-lg leading-tight mb-6 md:mb-8">
                      "{story.description}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-muted">
                    <h4 className="font-bold text-secondary/70">Tap to read more</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/70 whitespace-nowrap">
                    <br />
                      {story.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Modal Overlay */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={closeStory}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeStory}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-colors"
            >
              <X size={24} className="text-secondary" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto md:min-h-[500px] relative">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider text-white">
                  {selectedStory.category}
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <Quote size={48} className="text-primary mb-6 opacity-40" />
                <h3 className="text-3xl md:text-5xl font-black text-secondary mb-6 tracking-tighter leading-none lowercase">
                  {selectedStory.title}
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground font-bold leading-relaxed mb-8">
                  "{selectedStory.description}"
                </p>
                <div className="pt-6 border-t border-muted">
                  <p className="text-xs font-black uppercase tracking-widest text-secondary/60">
                    {selectedStory.author}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Stories;
