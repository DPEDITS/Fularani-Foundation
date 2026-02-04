import React, { useRef, useState, useEffect } from "react";
import { cn } from "../utils/cn";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
  Calendar,
  User,
} from "lucide-react";
import storyBg from "../assets/missions1.jpeg"; // Reusing for placeholder

const stories = [
  {
    id: 1,
    category: "Education",
    title: "Ranjeeta's Vision",
    description: "How one scholarship changed an entire family's future.",
    date: "Oct 12, 2025",
    author: "Sarah Jenkins",
    image: storyBg,
    content: (
      <>
        <p className="mb-4">
          Ranjeeta grew up in a small village where education for girls was
          often considered a luxury. Her parents, daily wage laborers, struggled
          to make ends meet, let alone afford school fees. But Ranjeeta had a
          dream—she wanted to be a teacher.
        </p>
        <p className="mb-4">
          Through the Fularani Foundation's "Mission Education," Ranjeeta was
          identified as a high-potential student. She received a full
          scholarship that covered her tuition, books, and uniform. But more
          than that, she received mentorship.
        </p>
        <p className="mb-4">
          "The scholarship took the burden off my parents," Ranjeeta says. "But
          the belief the foundation showed in me gave me the courage to keep
          going."
        </p>
        <p>
          Today, Ranjeeta is the first graduate in her family and is pursuing
          her B.Ed. She plans to return to her village to teach, ensuring that
          the next generation of girls has someone to look up to. Her vision has
          not only changed her future but is set to transform her entire
          community.
        </p>
      </>
    ),
  },
  {
    id: 2,
    category: "Sustainability",
    title: "The Green Village",
    description: "Transforming barren land into a thriving ecosystem.",
    date: "Sep 28, 2025",
    author: "Amit Patel",
    image: storyBg,
    content: (
      <>
        <p className="mb-4">
          Five years ago, the village of Rampur faced a severe crisis. The
          groundwater levels were depleting, and the once-fertile land was
          turning barren. Farmers were migrating to cities in search of work.
        </p>
        <p className="mb-4">
          "Mission Green" intervened with a community-led approach. We didn't
          just plant trees; we engaged the villagers in sustainable water
          management practices. Over 10,000 saplings were planted, focusing on
          native species that retain water.
        </p>
        <p>
          The results are visible today. The water table has risen by 12 feet.
          Utilizing the new resources, farmers have returned to multi-cropping.
          Rampur is now known as the "Green Village," a model for sustainable
          rural development.
        </p>
      </>
    ),
  },
  {
    id: 3,
    category: "Health",
    title: "Mobility for All",
    description: "Providing dignity through accessibility.",
    date: "Nov 05, 2025",
    author: "Dr. Priya Ray",
    image: storyBg,
    content: (
      <>
        <p className="mb-4">
          For 12-year-old Raju, the world was limited to the four walls of his
          home. Born with a congenital limb defect, he watched other children
          play from his window. His family couldn't afford a wheelchair.
        </p>
        <p className="mb-4">
          Under "Mission Mobility," our team visited Raju's village. We provided
          him with a custom-fitted wheelchair and arranged for physiotherapy
          sessions. The transformation was instant.
        </p>
        <p>
          "The smile on his face when he first moved the wheelchair himself was
          priceless," recalls our volunteer. Today, Raju attends school
          regularly. He is no longer defined by his disability but by his
          boundless energy and curiosity.
        </p>
      </>
    ),
  },
  {
    id: 4,
    category: "Volunteer",
    title: "A Day in Life",
    description: "Experience the joy of giving back.",
    date: "Dec 01, 2025",
    author: "Team Fularani",
    image: storyBg,
    content: (
      <>
        <p className="mb-4">
          What does it mean to be a volunteer at Fularani Foundation? It means
          waking up early to prepare meals for "Mission Hunger." It means
          spending weekends teaching math to eager students under a banyan tree.
        </p>
        <p className="mb-4">
          "It's not just about giving time," says Anjali, a software engineer
          and weekend volunteer. "It's about the connection you build. When a
          child grasps a concept you taught, or an elder blesses you for a meal,
          that satisfaction is unparalleled."
        </p>
        <p>
          Volunteering is the heartbeat of our organization. It bridges the gap
          between those who have and those who need, creating a circle of
          compassion that enriches everyone involved.
        </p>
      </>
    ),
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedStory]);

  return (
    <section className="py-20 bg-[#f5f5f7] overflow-hidden relative">
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
              onClick={() => setSelectedStory(story)}
              className="min-w-[300px] md:min-w-[400px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-black/5 cursor-pointer flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative shrink-0">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800">
                  {story.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-3 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-grow">
                  {story.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStory(story);
                  }}
                  className="inline-flex items-center text-blue-600 font-semibold text-sm group/link mt-auto"
                >
                  Read Story{" "}
                  <ArrowUpRight
                    size={16}
                    className="ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STORY MODAL OVERLAY */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedStory(null)}
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md flex items-center justify-center transition-colors text-white md:text-gray-800 md:bg-gray-100 md:hover:bg-gray-200"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
              <div className="absolute inset-0 bg-black/10 md:hidden z-0" />{" "}
              {/* Overlay for mobile text readability if needed */}
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 md:hidden">
                <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-900 shadow-sm border border-gray-100">
                  {selectedStory.category}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
              <div className="hidden md:flex items-center gap-3 mb-6">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedStory.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Calendar size={14} />
                  {selectedStory.date}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedStory.title}
              </h2>

              <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm pb-6 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <User size={16} />
                </div>
                <span>
                  By{" "}
                  <span className="font-medium text-gray-900">
                    {selectedStory.author}
                  </span>
                </span>
              </div>

              <div className="prose prose-lg text-gray-600 leading-relaxed">
                {selectedStory.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Stories;
