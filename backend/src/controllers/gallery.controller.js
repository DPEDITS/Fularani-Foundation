import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GalleryItem } from "../models/galleryItem.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, category, uploadedBy, description, imageLink } = req.body;
  if (!title || !category) {
    throw new ApiError(400, "Title and category are required");
  }

  const files = req.files || [];
  
  if (files.length === 0 && !imageLink) {
    throw new ApiError(400, "At least one image or image link is required");
  }

  let createdItems = [];

  if (files.length > 0) {
    console.log(`[Gallery] Processing ${files.length} uploads...`);
    // Process files one by one to ensure stability and avoid rate limits/timeouts
    for (const file of files) {
      if (!file.path) continue;
      try {
        const uploadResult = await uploadOnCloudinary(file.path);
        if (uploadResult) {
          const newItem = await GalleryItem.create({
            title,
            category,
            imageUrl: uploadResult.secure_url,
            uploadedBy: uploadedBy || "",
            description: description || "",
          });
          createdItems.push(newItem);
          console.log(`[Gallery] Uploaded and saved: ${file.originalname}`);
        }
      } catch (error) {
        console.error(`[Gallery] Failed to process ${file.originalname}:`, error);
        // Continue with next file
      }
    }
  } else if (imageLink) {
    // Handle single image link
    const galleryItem = await GalleryItem.create({
      title,
      category,
      imageUrl: imageLink,
      uploadedBy: uploadedBy || "",
      description: description || "",
    });
    createdItems.push(galleryItem);
  }

  if (createdItems.length === 0) {
    throw new ApiError(500, "All uploads failed. Please try again.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdItems.length === 1 ? createdItems[0] : createdItems,
        `${createdItems.length} Gallery item(s) created successfully`
      )
    );
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await GalleryItem.findById(req.params.id);

  if (!galleryItem) {
    throw new ApiError(404, "Gallery item not found");
  }

  if (galleryItem.imageUrl) {
    const publicId = galleryItem.imageUrl.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await GalleryItem.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Gallery item deleted Successfully"));
});

const getGalleryItemById = asyncHandler(async (req, res) => {
  const galleryItem = await GalleryItem.findById(req.params.id).select(
    "-password -refreshToken",
  );
  if (!galleryItem) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the gallery item",
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, galleryItem, "Gallery item fetched Successfully"),
    );
});

const getAllGalleryItems = asyncHandler(async (req, res) => {
  const galleryItems = await GalleryItem.find().select(
    "-password -refreshToken",
  );
  if (!galleryItems) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the gallery items",
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, galleryItems, "Gallery items fetched Successfully"),
    );
});

const updateGalleryItem = asyncHandler(async (req, res) => {
  const { title, category, uploadedBy, description, imageLink } = req.body;
  if (!title || !category) {
    throw new ApiError(400, "Title and category are required");
  }

  const galleryItem = await GalleryItem.findById(req.params.id);
  if (!galleryItem) {
    throw new ApiError(404, "Gallery item not found");
  }

  const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;
  let imageUrl = galleryItem.imageUrl;

  if (imageUrlLocalPath) {
    const uploadedImage = await uploadOnCloudinary(imageUrlLocalPath);
    if (uploadedImage) {
      imageUrl = uploadedImage.secure_url;
    }
  } else if (imageLink) {
    imageUrl = imageLink;
  }

  const updatedGalleryItem = await GalleryItem.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title,
        category,
        imageUrl,
        uploadedBy: uploadedBy || galleryItem.uploadedBy,
        description: description || "",
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  if (!updatedGalleryItem) {
    throw new ApiError(
      500,
      "Something went wrong while updating the gallery item",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedGalleryItem,
        "Gallery item updated Successfully",
      ),
    );
});

export {
  createGalleryItem,
  updateGalleryItem,
  getGalleryItemById,
  getAllGalleryItems,
  deleteGalleryItem,
};
