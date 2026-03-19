import { Content } from "../models/content.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/*
    CREATE CONTENT
*/
const createContent = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    category,
    eventDate,
    status,
    isPublished,
    author,
  } = req.body;

  const markdown = req.files?.markdownFile?.[0]?.path;
  const coverImage = req.files?.coverImage?.[0]?.path;
  const images = req.files?.images; // Array of files

  if (!title || !shortDescription || !category || !markdown || !author) {
    throw new ApiError(400, "Required fields missing");
  }

  // Upload markdown file
  const markdownUpload = await uploadOnCloudinary(markdown);
  if (!markdownUpload) {
    throw new ApiError(400, "Markdown file upload failed");
  }

  // Upload cover image (optional)
  let coverImageUpload = null;
  if (coverImage) {
    coverImageUpload = await uploadOnCloudinary(coverImage);
  }

  // Upload additional images
  let imageUrls = [];
  if (images && images.length > 0) {
    for (const image of images) {
      const uploaded = await uploadOnCloudinary(image.path);
      if (uploaded?.url) {
        imageUrls.push(uploaded.url);
      }
    }
  }

  const content = await Content.create({
    title,
    shortDescription,
    category,
    eventDate,
    status,
    isPublished,
    markdownFile: markdownUpload.url,
    coverImage: coverImageUpload?.url || "",
    images: imageUrls,
    createdBy: req.user?._id,
    author,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, content, "Content created successfully"));
});

/*
    GET ALL CONTENT
*/
const getAllContent = asyncHandler(async (req, res) => {
  const contents = await Content.find({ isPublished: true }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, contents, "Contents fetched successfully"));
});

/*
    GET CONTENT BY ID
*/
const getContentById = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content fetched successfully"));
});

/*
    UPDATE CONTENT
*/
const updateContent = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    category,
    eventDate,
    status,
    isPublished,
    author,
  } = req.body;

  const markdown = req.files?.markdownFile?.[0]?.path;
  const coverImage = req.files?.coverImage?.[0]?.path;
  const images = req.files?.images; // Array of files
  
  const updateData = {
    title,
    shortDescription,
    category,
    eventDate,
    status,
    isPublished,
    author,
  };

  if (markdown) {
    const markdownUpload = await uploadOnCloudinary(markdown);
    updateData.markdownFile = markdownUpload.url;
  }

  if (coverImage) {
    const uploaded = await uploadOnCloudinary(coverImage);
    updateData.coverImage = uploaded.url;
  }

  if (images && images.length > 0) {
    let imageUrls = [];
    for (const image of images) {
      const uploaded = await uploadOnCloudinary(image.path);
      if (uploaded?.url) {
        imageUrls.push(uploaded.url);
      }
    }
    updateData.images = imageUrls;
  }

  const content = await Content.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content updated successfully"));
});

/*
    DELETE CONTENT
*/
const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findByIdAndDelete(req.params.id);

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content deleted successfully"));
});

export {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
};
