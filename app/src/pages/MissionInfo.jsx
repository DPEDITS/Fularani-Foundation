import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
import { missions } from "../data/missions";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { motion } from "motion/react";
import { getAllGalleryItems } from "../services/galleryService";

const MissionInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mission = missions.find((m) => m.id === id);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (!mission?.galleryCategory) return;

      try {
        setLoading(true);
        const response = await getAllGalleryItems();
        const allItems = response.data || [];

        // Filter images specific to this mission
        const relevantImages = allItems
          .filter((item) => item.category === mission.galleryCategory)
          .map((item) => item.imageUrl)
          .slice(0, 4); // Take top 4 for the showcase

        setGalleryImages(relevantImages);
      } catch (error) {
        console.error("Failed to load mission gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [mission]);

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-6">
        <div>
          <h2 className="text-4xl font-black text-secondary mb-4">
            Mission Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The mission you are looking for does not exist.
          </p>
          <button
            onClick={() => safeNavigate(navigate, "/missions")}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    subtitle,
    description,
    longDescription,
    stats,
    theme,
    icon: Icon,
  } = mission;

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Navigation Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Link
          to="/missions"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Back to Missions
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="relative px-6 pb-20 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-current to-transparent opacity-5 pointer-events-none"
          style={{ color: theme.bg }}
        ></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${theme.bg} ${theme.primary} font-bold text-sm tracking-wide uppercase mb-8`}
            >
              <Icon size={18} />
              {subtitle}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-secondary leading-[0.9] tracking-tighter mb-8 max-w-4xl">
              {title}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[800px] font-medium mb-12">
              {description}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-8 rounded-3xl ${theme.bg} border border-white/20 shadow-sm`}
              >
                <div className={`${theme.primary} mb-4`}>
                  <stat.icon size={32} />
                </div>
                <div
                  className={`text-4xl md:text-5xl font-black ${theme.primary} mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-secondary/60 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT */}
      <section className="py-24 px-6 bg-[#f5f5f7] relative">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid md:grid-cols-[1fr_300px] gap-16">
            <div>
              <div className="prose prose-lg prose-slate text-lg text-secondary/80 leading-relaxed font-medium">
                <p>{longDescription}</p>
                <p className="marginTop-6">
                  We are committed to making a long-term difference. Your
                  support enables us to expand our reach, improve our resources,
                  and touch more lives. Join us in this journey of
                  transformation.
                </p>
              </div>

              {/* GALLERY SECTION */}
              {/* Only show if we have images or are loading */}
              {(loading || galleryImages.length > 0) && (
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                      <span
                        className={`w-8 h-1 rounded-full ${theme.bg.replace("bg-", "bg-opacity-100 bg-")}`}
                      ></span>
                      Impact in Action
                    </h3>
                    {galleryImages.length > 0 && (
                      <Link
                        to="/gallery"
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        View Full Gallery
                      </Link>
                    )}
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 gap-4 animate-pulse">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`bg-gray-200 rounded-2xl ${i === 1 || i === 4 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {galleryImages.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className={`relative rounded-2xl overflow-hidden group ${idx === 0 || idx === 3 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
                        >
                          <img
                            src={img}
                            alt={`${title} highlight ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar / CTA */}
            <div className="md:sticky md:top-24 h-fit space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-black/5">
                <h4 className="text-xl font-bold mb-2">Support this Mission</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Your contribution directly impacts lives.
                </p>

                <a
                  href="/donor-register"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white mb-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: theme.color }}
                >
                  <Heart size={18} fill="currentColor" />
                  Donate Now
                </a>

                <a
                  href="/volunteer-register"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold bg-secondary text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Become a Volunteer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-20 px-6 ${theme.bg}`}>
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-secondary mb-8 tracking-tight">
            Ready to make a difference?
          </h2>
          <Link
            to="/missions"
            className="inline-flex items-center gap-2 text-lg font-bold hover:underline underline-offset-4 decoration-2"
          >
            Explore other missions <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MissionInfo;
