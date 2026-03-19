import React, { useEffect } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { useParams, useNavigate, Link } from "react-router-dom";
import { storyData } from "../data/storyData";
import { safeNavigate } from "../utils/safeNavigate";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

const StoryInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const story = storyData.find((s) => s.id === id);
  const storyIndex = storyData.findIndex((s) => s.id === id);
  const prevStory = storyIndex > 0 ? storyData[storyIndex - 1] : null;
  const nextStory =
    storyIndex < storyData.length - 1 ? storyData[storyIndex + 1] : null;

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
    shortDescription,
    description,
    category,
    coverImage,
    author,
    date,
    tags,
    images,
    content,
  } = story;

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
            {shortDescription || subtitle}
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
            <a
              href="https://www.facebook.com/fularaniorg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-[#1877F2] transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://x.com/fularaniorg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-black transition-colors"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://in.linkedin.com/company/fularanifoundation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-[#0A66C2] transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-secondary transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* FEATURED IMAGE */}
        {coverImage && (
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl">
            <img
              src={getSecureCloudinaryUrl(coverImage)}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* LONG DESCRIPTION */}
        {description && (
          <div className="mx-auto mb-16">
            {description.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-lg md:text-xl text-secondary/80 leading-relaxed mb-6"
              >
                {para.split(/(\*\*.*?\*\*)/).map((segment, j) => {
                  if (segment.startsWith("**") && segment.endsWith("**")) {
                    return (
                      <strong key={j} className="font-bold text-secondary">
                        {segment.slice(2, -2)}
                      </strong>
                    );
                  }
                  return segment;
                })}
              </p>
            ))}
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="prose prose-lg md:prose-xl prose-slate mx-auto text-secondary/80 leading-relaxed font-serif">
          {content &&
            content.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={index}
                    className="text-3xl md:text-4xl font-black text-secondary tracking-tight mt-12 mb-6 font-sans border-b-2 border-primary/20 pb-2 inline-block"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <p key={index} className="mb-6">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "image") {
                return (
                  <figure
                    key={index}
                    className="my-10 rounded-2xl overflow-hidden shadow-lg not-prose"
                  >
                    <img
                      src={getSecureCloudinaryUrl(block.src)}
                      alt={block.caption || ""}
                      className="w-full h-auto object-cover"
                    />
                    {block.caption && (
                      <figcaption className="text-center text-sm font-medium text-muted-foreground py-3 px-4 bg-gray-50/80">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
        </div>

        {/* GALLERY SECTION */}
        {images && images.length > 0 && (
          <div className="mt-16 mb-16">
            <h3 className="text-2xl font-black text-secondary mb-6 border-l-4 border-primary pl-4">
              Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={getSecureCloudinaryUrl(img)}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAGS */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
          {tags &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
        </div>

        {/* PREV / NEXT NAVIGATION */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          {prevStory ? (
            <Link
              to={`/stories/${prevStory.id}`}
              className="group flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <ArrowLeft
                size={20}
                className="mt-1 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Previous Story
                </span>
                <p className="text-lg font-black text-secondary mt-1 leading-tight group-hover:text-primary transition-colors">
                  {prevStory.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextStory ? (
            <Link
              to={`/stories/${nextStory.id}`}
              className="group flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all text-right md:justify-end"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Next Story
                </span>
                <p className="text-lg font-black text-secondary mt-1 leading-tight group-hover:text-primary transition-colors">
                  {nextStory.title}
                </p>
              </div>
              <ArrowRight
                size={20}
                className="mt-1 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
              />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
};

export default StoryInfo;
