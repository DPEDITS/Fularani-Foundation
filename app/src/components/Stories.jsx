import React, { useRef } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { storyData } from "../data/storyData";

const Stories = () => {
  const scrollContainerRef = useRef(null);
  const stories = storyData;

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

  if (stories.length === 0) {
    return null; // Or a loading state
  }

  return (
    <section className="py-16 md:py-32 bg-muted/30 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-xl">
            <div className="inline-block bg-accent px-4 py-1 rounded-sm text-[12px] md:text-[15px] font-black uppercase tracking-widest text-secondary mb-3 md:mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-secondary tracking-tighter leading-none lowercase">
              voice of <br />
              <span className="text-white bg-primary px-2 md:px-4 py-1 inline-block rotate-1">
                the field.
              </span>
            </h2>
          </div>
          <div className="flex gap-3 md:gap-4">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-secondary/10 flex items-center justify-center hover:bg-primary transition-all group"
            >
              <ArrowLeft
                size={20}
                className="group-active:scale-90 md:w-6 md:h-6 transition-transform"
              />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary text-white flex items-center justify-center hover:bg-accent transition-all group shadow-xl shadow-secondary/20"
            >
              <ArrowRight
                size={20}
                className="group-active:scale-95 md:w-6 md:h-6 transition-transform"
              />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
        >
          {stories.map((story, index) => (
            <Link
              key={story.id}
              to={`/stories/${story.id}`}
              className="min-w-[85vw] md:min-w-[500px] snap-start bg-white shadow-2xl overflow-hidden group border border-secondary/5 cursor-pointer hover:shadow-3xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 h-40 md:h-auto overflow-hidden relative">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider text-white">
                    {story.category}
                  </div>
                </div>

                <div className="w-full md:w-3/5 p-5 md:p-10 flex flex-col justify-between">
                  <div>
                    <Quote
                      className="text-primary mb-2 md:mb-4 opacity-40 w-6 h-6 md:w-8 md:h-8"
                    />
                    <h3 className="text-xl md:text-3xl font-black text-secondary mb-2 md:mb-4 tracking-tighter leading-none line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-muted-foreground font-bold text-sm md:text-lg leading-tight mb-4 md:mb-6 line-clamp-3">
                      "{story.shortDescription || story.subtitle}"
                    </p>
                  </div>

                  <div className="pt-4 md:pt-6 border-t border-muted">
                    <button className="font-bold text-xs md:text-sm text-secondary/70 hover:text-blue-800 transition-colors uppercase tracking-wider">
                      Tap to read more
                    </button>
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-secondary/70 whitespace-nowrap mt-1 md:mt-2">
                      {story.author}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;
