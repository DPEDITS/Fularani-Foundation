import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { safeNavigate } from "../utils/safeNavigate";
import { stories } from "../data/stories";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const StoryInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ensure stories is loaded and id exists
  const story = stories && id ? stories.find((s) => s.id === id) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-6">
        <div>
          <h2 className="text-4xl font-black text-secondary mb-4">
            Story Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The story you are looking for does not exist.
          </p>
          <button
            onClick={() => safeNavigate(navigate, "/")}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    subtitle,
    category,
    coverImage,
    image,
    author,
    date,
    content,
  } = story;
  const heroImage = coverImage || image;

  return (
    <article className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1000px] mx-auto px-6">
        {/* BREADCRUMB */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-black transition-colors font-medium mb-8"
        >
          <ArrowLeft size={18} />
          Back to Stories
        </Link>

        {/* HEADER */}
        <header className="mb-12">
          <div className="inline-block bg-accent px-4 py-1 rounded-sm text-sm font-black uppercase tracking-widest text-secondary mb-6">
            {category}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-secondary leading-[1.1] tracking-tighter mb-8">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl border-l-4 border-primary pl-6">
            {subtitle}
          </p>
        </header>

        {/* META & AUTHOR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-y border-gray-100 py-6 mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-secondary">{author}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar size={14} /> {date}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-secondary mr-2">
              Share:
            </span>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-blue-600 transition-colors">
              <Facebook size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-blue-400 transition-colors">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-blue-700 transition-colors">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-secondary transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* FEATURED IMAGE */}
        <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* CONTENT BODY */}
        <div className="prose prose-lg md:prose-xl prose-slate mx-auto text-secondary/80 leading-relaxed font-serif">
          {content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2
                    key={index}
                    className="text-3xl md:text-4xl font-black text-secondary tracking-tight mt-12 mb-6 font-sans border-b-2 border-primary/20 pb-2 inline-block"
                  >
                    {block.text}
                  </h2>
                );
              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="my-10 pl-8 border-l-8 border-primary bg-gray-50 py-8 pr-8 rounded-r-xl italic text-2xl text-secondary font-medium relative"
                  >
                    <span className="absolute top-4 left-4 text-6xl text-primary/20 font-black pointer-events-none">
                      “
                    </span>
                    {block.text}
                    <footer className="mt-4 text-sm font-bold uppercase tracking-widest not-italic text-primary">
                      — {block.author}
                    </footer>
                  </blockquote>
                );
              case "image":
                return (
                  <figure
                    key={index}
                    className="my-10 rounded-2xl overflow-hidden shadow-lg not-prose"
                  >
                    <img
                      src={block.src}
                      alt={block.caption || "Story image"}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {block.caption && (
                      <figcaption className="text-center text-sm font-medium text-muted-foreground py-3 px-4 bg-gray-50/80">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              case "paragraph":
              default:
                return (
                  <p
                    key={index}
                    className="mb-6 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left"
                  >
                    {block.text}
                  </p>
                );
            }
          })}
        </div>

        {/* TAGS (Optional placeholder) */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
            Impact
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
            {category}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
            Success Story
          </span>
        </div>
      </div>

      {/* NEXT STORY NAV */}
      <section className="mt-20 border-t border-gray-100 bg-gray-50 py-20 px-6">
        <div className="max-w-[1000px] mx-auto text-center">
          <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-6">
            Read Next
          </h3>

          {/* Simple logic to just show the next one, or loop back to first */}
          {(() => {
            const currentIndex = stories.findIndex((s) => s.id === id);
            const nextStory = stories[(currentIndex + 1) % stories.length];

            return (
              <Link to={`/stories/${nextStory.id}`} className="group block">
                <h2 className="text-4xl md:text-6xl font-black text-secondary group-hover:text-primary transition-colors tracking-tighter mb-4">
                  {nextStory.title}
                </h2>
                <div className="inline-flex items-center gap-2 text-lg font-bold text-muted-foreground group-hover:underline underline-offset-4">
                  Read Story <ArrowRight size={20} />
                </div>
              </Link>
            );
          })()}
        </div>
      </section>
    </article>
  );
};

export default StoryInfo;
