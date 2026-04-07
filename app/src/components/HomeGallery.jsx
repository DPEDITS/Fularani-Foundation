import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera } from "lucide-react";
import { motion as Motion } from "motion/react";
import LazyImage from "./LazyImage";

const galleryImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dnbgja6dx/image/upload/w_600,q_auto,f_auto/v1775551216/IMG_6745_uezv8s.jpg",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dnbgja6dx/image/upload/w_600,q_auto,f_auto/v1775550639/IMG_9684_hxin4w.jpg",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dnbgja6dx/image/upload/w_600,q_auto,f_auto/v1775550654/IMG_6946_dgq2yi.jpg",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dnbgja6dx/image/upload/w_600,q_auto,f_auto/v1775550511/e6eb7f79-ff70-49bb-ab38-895a382ac2b6_ftuh3y.jpg",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dnbgja6dx/image/upload/w_600,q_auto,f_auto/v1775550576/IMG_7576_sdv1zo.jpg",
  },
  // {
  //   id: 6,
  //   src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&h=800&fit=crop",
  //   alt: "Students with digital tablets",
  //   caption: "Digital Literacy",
  // },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HomeGallery = () => {
  return (
    <section className="py-20 md:py-32 bg-[#fafafa] relative overflow-hidden" id="gallery-preview">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/8 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary px-4 py-1 rounded-sm text-[12px] font-black uppercase tracking-[0.2em] text-white mb-6">
              <Camera size={14} />
              Gallery
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-7xl font-black text-secondary tracking-tighter leading-[0.85] lowercase">
              moments that{" "}
              <br />
              <span className="text-secondary bg-accent px-4 py-1 inline-block -rotate-1 mt-3">
                define us.
              </span>
            </h2>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <p className="text-lg md:text-xl font-bold text-muted-foreground max-w-sm leading-tight pb-4 border-l-4 md:border-l-0 md:border-r-4 border-primary pl-6 md:pl-0 md:pr-6 md:text-right">
              A glimpse into our journey of impact, resilience, and
              community-driven change across rural India.
            </p>
          </Motion.div>
        </div>

        {/* Masonry-style Image Grid */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
        >
          {/* Image 1 */}
          <Motion.div
            variants={imageVariants}
            className="col-span-1 relative rounded-[20px] md:rounded-[28px] overflow-hidden shadow-lg"
          >
            <div className="aspect-[4/3]">
              <LazyImage
                src={galleryImages[0].src}
                alt={galleryImages[0].alt || "Gallery Image 1"}
                className="w-full h-full"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 md:p-5">
              <span className="text-white text-xs md:text-sm font-bold tracking-tight">
                {galleryImages[0].caption}
              </span>
            </div>
          </Motion.div>

          {/* Image 2 - Tall on desktop */}
          <Motion.div
            variants={imageVariants}
            className="col-span-1 md:row-span-2 relative rounded-[20px] md:rounded-[28px] overflow-hidden shadow-lg"
          >
            <div className="aspect-[4/3] md:aspect-auto md:h-full">
              <LazyImage
                src={galleryImages[1].src}
                alt={galleryImages[1].alt || "Gallery Image 2"}
                className="w-full h-full"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 md:p-5">
              <span className="text-white text-xs md:text-sm font-bold tracking-tight">
                {galleryImages[1].caption}
              </span>
            </div>
          </Motion.div>

          {/* Image 3 - Wide on mobile */}
          <Motion.div
            variants={imageVariants}
            className="col-span-2 md:col-span-1 relative rounded-[20px] md:rounded-[28px] overflow-hidden shadow-lg"
          >
            <div className="aspect-[16/9] md:aspect-[4/3]">
              <LazyImage
                src={galleryImages[2].src}
                alt={galleryImages[2].alt || "Gallery Image 3"}
                className="w-full h-full"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 md:p-5">
              <span className="text-white text-xs md:text-sm font-bold tracking-tight">
                {galleryImages[2].caption}
              </span>
            </div>
          </Motion.div>

          {/* Image 4 */}
          <Motion.div
            variants={imageVariants}
            className="col-span-1 relative rounded-[20px] md:rounded-[28px] overflow-hidden shadow-lg"
          >
            <div className="aspect-[4/3]">
              <LazyImage
                src={galleryImages[3].src}
                alt={galleryImages[3].alt || "Gallery Image 4"}
                className="w-full h-full"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 md:p-5">
              <span className="text-white text-xs md:text-sm font-bold tracking-tight">
                {galleryImages[3].caption}
              </span>
            </div>
          </Motion.div>

          {/* Image 5 */}
          <Motion.div
            variants={imageVariants}
            className="col-span-1 relative rounded-[20px] md:rounded-[28px] overflow-hidden shadow-lg"
          >
            <div className="aspect-[4/3]">
              <LazyImage
                src={galleryImages[4].src}
                alt={galleryImages[4].alt || "Gallery Image 5"}
                className="w-full h-full"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 md:p-5">
              <span className="text-white text-xs md:text-sm font-bold tracking-tight">
                {galleryImages[4].caption}
              </span>
            </div>
          </Motion.div>
        </Motion.div>

        {/* CTA Button */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 bg-secondary text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-tight text-sm md:text-base shadow-xl shadow-secondary/20"
          >
            View Full Gallery
            <ArrowRight size={20} />
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default HomeGallery;
