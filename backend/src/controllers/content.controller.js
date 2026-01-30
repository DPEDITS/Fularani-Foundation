import { Content } from "../models/content.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createContent = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    shortDescription,
    fullDescription,
    category,
    location,
    startDate,
    endDate,
    eventDate,
    status,
    isPublished,
  } = req.body;
  const images = req.files?.images?.[0]?.path;
  const coverImage = req.files?.coverImage?.[0]?.path;

  if (
    !type ||
    !title ||
    !shortDescription ||
    !fullDescription ||
    !category ||
    !location ||
    !startDate ||
    !endDate ||
    !eventDate ||
    !status ||
    !isPublished
  ) {
    throw new ApiError(400, "All fields are required");
  }
  let imageUrl;
  if (images) {
    imageUrl = await uploadOnCloudinary(images);
  }
  if (!imageUrl) {
    throw new ApiError(400, "Image is required");
  }
  let coverImageUrl;
  if (coverImage) {
    coverImageUrl = await uploadOnCloudinary(coverImage);
  }
  if (!coverImageUrl) {
    throw new ApiError(400, "Cover Image is required");
  }

  // Parse dates in DD/MM/YYYY format
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  let parsedStartDate = startDate;
  if (typeof startDate === "string") {
    const match = startDate.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedStartDate = new Date(year, month - 1, day);
    }
  }
  let parsedEndDate = endDate;
  if (typeof endDate === "string") {
    const match = endDate.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedEndDate = new Date(year, month - 1, day);
    }
  }
  let parsedEventDate = eventDate;
  if (typeof eventDate === "string") {
    const match = eventDate.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedEventDate = new Date(year, month - 1, day);
    }
  }

  const content = await Content.create({
    type: type.toUpperCase(),
    title,
    shortDescription,
    fullDescription,
    category,
    location,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    eventDate: parsedEventDate,
    status: status.toLowerCase(),
    isPublished,
    images: imageUrl?.url || "",
    coverImage: coverImageUrl?.url || "",
  });
  const createdContent = await Content.findById(content._id).select(
    "-password -refreshToken",
  );
  if (!createdContent) {
    throw new ApiError(500, "Something went wrong while creating the content");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdContent, "Content created Successfully"));
});

const getAllContent = asyncHandler(async (req, res) => {
  const contents = await Content.find().select("-password -refreshToken");
  if (!contents) {
    throw new ApiError(500, "Something went wrong while fetching the contents");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, contents, "Contents fetched Successfully"));
});

const getContentById = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id).select(
    "-password -refreshToken",
  );
  if (!content) {
    throw new ApiError(500, "Something went wrong while fetching the content");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content fetched Successfully"));
});

const updateContent = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    shortDescription,
    fullDescription,
    category,
    location,
    startDate,
    endDate,
    eventDate,
    status,
    isPublished,
  } = req.body;
  const images = req.files?.images?.[0]?.path;
  const coverImage = req.files?.coverImage?.[0]?.path;

  if (
    !type ||
    !title ||
    !shortDescription ||
    !fullDescription ||
    !category ||
    !location ||
    !startDate ||
    !endDate ||
    !eventDate ||
    !status ||
    !isPublished
  ) {
    throw new ApiError(400, "All fields are required");
  }
  let imageUrl;
  if (images) {
    imageUrl = await uploadOnCloudinary(images);
  }
  let coverImageUrl;
  if (coverImage) {
    coverImageUrl = await uploadOnCloudinary(coverImage);
  }
  let parsedStartDate = startDate;
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (typeof startDate === "string") {
    const match = startDate.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedStartDate = new Date(year, month - 1, day);
    }
  }
  let parsedEndDate = endDate;
  if (typeof endDate === "string") {
    const match = endDate.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedEndDate = new Date(year, month - 1, day);
    }
  }
  let parsedEventDate = eventDate;
  if (typeof eventDate === "string") {
    const match = eventDate.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedEventDate = new Date(year, month - 1, day);
    }
  }

  const content = await Content.findByIdAndUpdate(
    req.params.id,
    {
      type,
      title,
      shortDescription,
      fullDescription,
      category,
      location,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      eventDate: parsedEventDate,
      status,
      isPublished,
      images: imageUrl?.url || "",
      coverImage: coverImageUrl?.url || "",
    },
    { new: true },
  ).select("-password -refreshToken");
  if (!content) {
    throw new ApiError(500, "Something went wrong while updating the content");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content updated Successfully"));
});

const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findByIdAndDelete(req.params.id).select(
    "-password -refreshToken",
  );
  if (!content) {
    throw new ApiError(500, "Something went wrong while deleting the content");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, content, "Content deleted Successfully"));
});

export {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
};
