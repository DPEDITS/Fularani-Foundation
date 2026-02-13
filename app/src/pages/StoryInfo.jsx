import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getContentById } from "../services/contentService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { safeNavigate } from "../utils/safeNavigate";
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
  const [story, setStory] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await getContentById(id);
        if (response.success) {
          setStory(response.data);
          // Fetch markdown content
          if (response.data.markdownFile) {
            const mdResponse = await fetch(response.data.markdownFile);
            const text = await mdResponse.text();
            setMarkdownContent(text);
          }
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Failed to fetch story", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl font-bold text-secondary">Loading...</div>
      </div>
    );
  }

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

  const { title, shortDescription, category, coverImage, author, createdAt } =
    story;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            {shortDescription}
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
                <Calendar size={14} /> {formattedDate}
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
        {coverImage && (
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="prose prose-lg md:prose-xl prose-slate mx-auto text-secondary/80 leading-relaxed font-serif">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-4xl md:text-5xl font-black text-secondary tracking-tight mt-12 mb-6 font-sans"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl md:text-4xl font-black text-secondary tracking-tight mt-12 mb-6 font-sans border-b-2 border-primary/20 pb-2 inline-block"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl md:text-3xl font-bold text-secondary mt-8 mb-4 font-sans"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => <p className="mb-6" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="my-10 pl-8 border-l-8 border-primary bg-gray-50 py-8 pr-8 rounded-r-xl italic text-2xl text-secondary font-medium relative"
                  {...props}
                >
                  <span className="absolute top-4 left-4 text-6xl text-primary/20 font-black pointer-events-none">
                    “
                  </span>
                  {props.children}
                </blockquote>
              ),
              img: ({ node, ...props }) => (
                <figure className="my-10 rounded-2xl overflow-hidden shadow-lg not-prose">
                  <img className="w-full h-auto object-cover" {...props} />
                  {props.title && (
                    <figcaption className="text-center text-sm font-medium text-muted-foreground py-3 px-4 bg-gray-50/80">
                      {props.title}
                    </figcaption>
                  )}
                </figure>
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-6" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 mb-6" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-2" {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>

        {/* GALLERY SECTION */}
        {story.images && story.images.length > 0 && (
          <div className="mt-16 mb-16">
            <h3 className="text-2xl font-black text-secondary mb-6 border-l-4 border-primary pl-4">
              Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {story.images.map((img, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={img}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
    </article>
  );
};

export default StoryInfo;
