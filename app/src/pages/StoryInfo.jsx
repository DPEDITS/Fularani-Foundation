import React, { useEffect, useState } from "react";
import { getSecureCloudinaryUrl } from "../utils/imageUtils";
import { useParams, useNavigate, Link } from "react-router-dom";
import { storyData } from "../data/storyData";
import { safeNavigate } from "../utils/safeNavigate";
import { getAllGalleryItems } from "../services/galleryService";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Share2,
  Facebook,
  Linkedin,
} from "lucide-react";

import SEO from "../components/SEO";

const StoryInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const story = storyData.find((s) => s.id === id);
  const storyIndex = storyData.findIndex((s) => s.id === id);
  const prevStory = storyIndex > 0 ? storyData[storyIndex - 1] : null;
  const nextStory =
    storyIndex < storyData.length - 1 ? storyData[storyIndex + 1] : null;

  const [dynamicGallery, setDynamicGallery] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGallery = async () => {
      if (id === "innovation-in-healthcare") {
        try {
          const response = await getAllGalleryItems();
          const allItems = response.data || [];
          const fetchedImages = allItems
            .filter(
              (item) => item.title && item.title.toLowerCase().includes("blood")
            )
            .map((item) => item.imageUrl);
          setDynamicGallery(fetchedImages);
        } catch (error) {
          console.error("Failed to fetch gallery items:", error);
        }
      } else {
        setDynamicGallery([]);
      }
    };
    fetchGallery();
  }, [id]);

  const [copied, setCopied] = React.useState(false);

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

  const combinedImages = [...(images || []), ...dynamicGallery];

  const sharePost = async (platform) => {
    const url = window.location.href;
    const imageUrl = getSecureCloudinaryUrl(coverImage);
    const caption = `${title}\n\nRead the complete story here: ${url}`;
    
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(caption);

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        // Twitter supports 'text' and 'url' separately
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title + "\n\nRead the complete story here:")}`;
        break;
      case "linkedin":
        // LinkedIn primarily uses the URL for scraping OG tags
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "native":
        if (navigator.share) {
          try {
            const shareData = {
              title: title,
              text: caption,
              url: url,
            };

            // Attempt to share as file if image is available and supported
            if (navigator.canShare && navigator.canShare({ files: [] }) && imageUrl) {
              try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${id}-preview.jpg`, { type: blob.type });
                
                if (navigator.canShare({ files: [file] })) {
                  shareData.files = [file];
                }
              } catch (err) {
                console.warn("Could not fetch image for file sharing:", err);
              }
            }

            await navigator.share(shareData);
            return;
          } catch (err) {
            console.error("Share failed:", err);
          }
        } else {
          // Fallback: Copy to clipboard
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        }
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <article className="min-h-screen bg-white pt-24 pb-20">
      <SEO 
        title={title} 
        description={shortDescription || subtitle} 
        image={getSecureCloudinaryUrl(coverImage)} 
      />
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
            <button
              onClick={() => sharePost("facebook")}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-[#1877F2] transition-colors"
              title="Share on Facebook"
            >
              <Facebook size={18} />
            </button>
            <button
              onClick={() => sharePost("twitter")}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-black transition-colors"
              title="Share on X"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </button>
            <button
              onClick={() => sharePost("linkedin")}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-secondary hover:text-[#0A66C2] transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </button>
            <div className="relative">
              <button
                onClick={() => sharePost("native")}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-secondary transition-colors"
                title="Share or Copy Link"
              >
                <Share2 size={18} />
              </button>
              {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg whitespace-nowrap animate-bounce">
                  Link Copied!
                </div>
              )}
            </div>
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

        {/* TRANSPARENCY CTA */}
        <div className="mt-16 p-8 md:p-12 bg-secondary rounded-[32px] text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 lowercase tracking-tight">
              committed to <span className="text-primary italic">transparency.</span>
            </h3>
            <p className="text-white/60 font-bold mb-8 max-w-lg mx-auto text-sm md:text-base">
              We believe in 100% financial openness. Explore our detailed reports and see exactly how every contribution makes an impact.
            </p>
            <Link
              to="/transparency"
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-secondary transition-all shadow-xl shadow-primary/20"
            >
              View Financial Documentation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* GALLERY SECTION */}
        {combinedImages && combinedImages.length > 0 && (
          <div className="mt-16 mb-16">
            <h3 className="text-2xl font-black text-secondary mb-6 border-l-4 border-primary pl-4">
              Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {combinedImages.map((img, index) => (
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
