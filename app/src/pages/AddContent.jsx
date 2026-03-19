import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContent } from "../services/contentService";
import {
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { isAdminAuthenticated, getAdminUser } from "../services/adminService";
import { useEffect } from "react";

const AddContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated() || getAdminUser()?.email !== "debashishparida75@gmail.com") {
      navigate("/");
    }
  }, [navigate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "Education", // Default
    author: "Fularani Foundation", // Default
    eventDate: "",
    status: "planning", // Default
    isPublished: true, // Always publish
  });

  // File States
  const [coverImage, setCoverImage] = useState(null);
  const [markdownFile, setMarkdownFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "coverImage") {
      setCoverImage(files[0]);
    } else if (name === "markdownFile") {
      setMarkdownFile(files[0]);
    } else if (name === "images") {
      setImages(Array.from(files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      // Append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append files
      if (coverImage) {
        data.append("coverImage", coverImage);
      }
      if (markdownFile) {
        data.append("markdownFile", markdownFile);
      }
      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await createContent(data);

      if (response.success) {
        setSuccess(true);
        // Reset form after a delay or redirect
        setTimeout(() => {
          navigate("/missions"); // Redirect to missions or stories page
        }, 2000);
      } else {
        setError(response.message || "Failed to create content");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin-dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-black transition-all font-bold mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs uppercase tracking-widest font-black">Back to Control Center</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-2">
              Add New Story
            </h1>
            <p className="text-muted-foreground">
              <span className="font-bold">Note:</span> Ensure you have the
              markdown file ready before submitting.
            </p>
          </header>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-start gap-3">
              <CheckCircle className="shrink-0 mt-0.5" size={20} />
              <p className="font-medium">
                Content created successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                placeholder="Enter story title"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none"
                placeholder="Brief summary for the card view..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="Enter category"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="Author Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Date */}
              <div>
                <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium bg-white"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="onhold">On Hold</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                Cover Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                    <Upload size={24} className="mb-2" />
                    <p className="text-sm font-medium">
                      <span className="font-bold text-primary">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {coverImage && (
                <p className="text-sm font-medium text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle size={14} /> {coverImage.name}
                </p>
              )}
            </div>

            {/* Markdown File Upload */}
            <div>
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                Story Content (Markdown)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                    <Upload size={24} className="mb-2" />
                    <p className="text-sm font-medium">
                      <span className="font-bold text-primary">
                        Click to upload
                      </span>{" "}
                      markdown file
                    </p>
                    <p className="text-xs">.MD files only</p>
                  </div>
                  <input
                    type="file"
                    name="markdownFile"
                    accept=".md"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
              {markdownFile && (
                <p className="text-sm font-medium text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle size={14} /> {markdownFile.name}
                </p>
              )}
            </div>

            {/* Additional Images Upload */}
            <div>
              <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                Additional Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                    <Upload size={24} className="mb-2" />
                    <p className="text-sm font-medium">
                      <span className="font-bold text-primary">
                        Click to upload
                      </span>{" "}
                      additional images
                    </p>
                    <p className="text-xs">Select multiple images (MAX. 10)</p>
                  </div>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-2 space-y-1">
                  {images.map((img, idx) => (
                    <p
                      key={idx}
                      className="text-sm font-medium text-green-600 flex items-center gap-1"
                    >
                      <CheckCircle size={14} /> {img.name}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Publishing...
                </>
              ) : (
                "Publish Story"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContent;
