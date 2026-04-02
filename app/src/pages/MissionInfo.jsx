import React, { useEffect, useState } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { useParams, useNavigate, Link } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
import { missions } from "../data/missions";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { motion } from "motion/react";
import { getAllGalleryItems } from "../services/galleryService";
import education1 from "../assets/11_missions/education1.jpg";
import education2 from "../assets/11_missions/education2.jpg";
import education3 from "../assets/11_missions/education3.jpg";
import missionEducation from "../assets/11_missions/mission_education.jpg";
import mobility1 from "../assets/11_missions/mobility_1.jpg";
import mobility2 from "../assets/11_missions/mobility_2.jpg";
import period1 from "../assets/11_missions/period1.jpg";
import period2 from "../assets/11_missions/period2.jpg";
import period3 from "../assets/11_missions/period3.jpg";
import period4 from "../assets/11_missions/period4.jpg";

const localMissionImages = {
  education: [missionEducation, education1, education2, education3],
  "education-for-all": [missionEducation, education1, education2, education3],
  "mission-mobility": [mobility1, mobility2],
  "mission-period-pride": [period1, period2, period3, period4],
};

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
      const localImages = localMissionImages[mission?.id] || [];

      if (!mission?.galleryCategory) {
        setGalleryImages(localImages);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAllGalleryItems();
        const allItems = response.data || [];

        // Filter images specific to this mission
        const relevantItems = allItems.filter(
          (item) => item.category === mission.galleryCategory
        );

        // Shuffle all available items first
        const shuffledItems = relevantItems.sort(() => Math.random() - 0.5);

        const selectedItems = [];
        const seenTitles = new Set();
        const fallbackItems = [];

        // Try to pick up to 4 images with explicitly different titles
        for (const item of shuffledItems) {
          if (!seenTitles.has(item.title)) {
            seenTitles.add(item.title);
            selectedItems.push(item);
          } else {
            fallbackItems.push(item);
          }

          if (selectedItems.length === 4) break;
        }

        // If we couldn't find 4 unique titles, pad with the duplicates
        while (selectedItems.length < 4 && fallbackItems.length > 0) {
          selectedItems.push(fallbackItems.shift());
        }

        const remoteImages = selectedItems.map((item) => item.imageUrl);
        const combinedImages = [...localImages, ...remoteImages].slice(0, 4);
        setGalleryImages(combinedImages);
      } catch (error) {
        console.error("Failed to load mission gallery:", error);
        setGalleryImages(localImages);
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
          <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
            Mission Not Found
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8">
            The mission you are looking for does not exist.
          </p>
          <button
            onClick={() => safeNavigate(navigate, "/missions")}
            className="bg-primary text-white px-7 py-3 rounded-xl text-sm md:text-base font-bold"
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
    sections,
    csrOpportunity,
    stats,
    theme,
    icon: Icon,
  } = mission;

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Navigation Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 py-7">
        <Link
          to="/missions"
          className="inline-flex items-center gap-2 text-sm md:text-[15px] text-muted-foreground font-medium"
        >
          <ArrowLeft size={18} />
          Back to Missions
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="relative px-6 pb-16 overflow-hidden">
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
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full ${theme.bg} ${theme.primary} font-bold text-[11px] md:text-xs tracking-[0.16em] uppercase mb-6`}
            >
              <Icon size={16} />
              {subtitle}
            </div>

            <h1 className="text-[2.4rem] md:text-5xl lg:text-6xl font-black text-secondary leading-[0.92] tracking-tighter mb-6 max-w-4xl">
              {title}
            </h1>

            <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-[760px] font-medium mb-10">
              {description}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-6 md:p-7 rounded-3xl ${theme.bg} border border-white/20 shadow-sm`}
              >
                <div className={`${theme.primary} mb-3`}>
                  <stat.icon size={26} />
                </div>
                <div
                  className={`text-3xl md:text-[2.2rem] font-black ${theme.primary} mb-1.5`}
                >
                  {stat.value}
                </div>
                <div className="text-[11px] md:text-xs font-bold text-secondary/60 uppercase tracking-[0.16em]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT */}
      <section className="py-20 px-6 bg-[#f5f5f7] relative">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid md:grid-cols-[1fr_300px] gap-12 md:gap-14">
            <div>
              <div className="prose prose-slate max-w-none text-[15px] md:text-[17px] text-secondary/80 leading-7 md:leading-8 font-medium">
                <p>{longDescription}</p>
              </div>

              {Array.isArray(sections) && sections.length > 0 && (
                <div className="mt-10 space-y-6">
                  {sections.map((section) => (
                    <div
                      key={section.title}
                      className="rounded-3xl bg-white p-6 md:p-7 shadow-sm border border-black/5"
                    >
                      <h3 className="text-xl md:text-2xl font-black text-secondary mb-3">
                        {section.title}
                      </h3>
                      {section.body && (
                        <p className="text-[15px] md:text-base text-secondary/80 leading-7 font-medium">
                          {section.body}
                        </p>
                      )}
                      {Array.isArray(section.items) && section.items.length > 0 && (
                        <ul className="mt-4 space-y-3">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-[15px] md:text-base text-secondary/80 font-medium leading-7"
                            >
                              <span
                                className={`mt-2.5 h-2 w-2 rounded-full ${theme.bg}`}
                              ></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {csrOpportunity && (
                    <div className="rounded-3xl bg-secondary p-6 md:p-7 text-white shadow-xl">
                      <h3 className="text-xl md:text-2xl font-black mb-3">
                        CSR Opportunity
                      </h3>
                      <p className="text-[15px] md:text-base text-white/85 leading-7 font-medium">
                        {csrOpportunity}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* GALLERY SECTION */}
              {/* Only show if we have images or are loading */}
              {(loading || galleryImages.length > 0) && (
                <div className="mt-14">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-black text-secondary flex items-center gap-3">
                      <span
                        className={`w-8 h-1 rounded-full ${theme.bg.replace("bg-", "bg-opacity-100 bg-")}`}
                      ></span>
                      Impact in Action
                    </h3>
                    {galleryImages.length > 0 && (
                      <Link
                        to="/gallery"
                        className="text-[12px] md:text-sm font-bold text-primary"
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
                          className={`relative rounded-2xl overflow-hidden ${idx === 0 || idx === 3 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
                        >
                          <img
                            src={img.startsWith("http") ? getSecureCloudinaryUrl(img) : img}
                            alt={`${title} highlight ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10"></div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar / CTA */}
            <div className="md:sticky md:top-24 h-fit space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl shadow-black/5 border border-black/5">
                <h4 className="text-lg md:text-xl font-bold mb-2">Support this Mission</h4>
                <p className="text-[13px] md:text-sm text-muted-foreground mb-5">
                  Your contribution directly impacts lives.
                </p>

                <a
                  href="/donor-register"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm md:text-base font-bold text-white mb-3"
                  style={{ backgroundColor: theme.color }}
                >
                  <Heart size={18} fill="currentColor" />
                  Donate Now
                </a>

                <a
                  href="/volunteer-register"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm md:text-base font-bold bg-secondary text-white"
                >
                  Become a Volunteer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-16 px-6 ${theme.bg}`}>
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6 tracking-tight">
            Ready to make a difference?
          </h2>
          <Link
            to="/missions"
            className="inline-flex items-center gap-2 text-sm md:text-base font-bold"
          >
            Explore other missions <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MissionInfo;
