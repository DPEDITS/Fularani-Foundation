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
  const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;
  let imageUrl;
  if (imageUrlLocalPath) {
    const uploadResult = await uploadOnCloudinary(imageUrlLocalPath);
    if (uploadResult) imageUrl = uploadResult.secure_url;
  } else if (imageLink) {
    imageUrl = imageLink;
  }

  if (!imageUrl) {
    throw new ApiError(400, "Image or image link is required");
  }
  const galleryItem = await GalleryItem.create({
    title,
    category,
    imageUrl,
    uploadedBy: uploadedBy || "",
    description: description || "",
  });
  const createdGalleryItem = await GalleryItem.findById(galleryItem._id).select(
    "-password -refreshToken",
  );
  if (!createdGalleryItem) {
    throw new ApiError(
      500,
      "Something went wrong while creating the gallery item",
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdGalleryItem,
        "Gallery item created Successfully",
      ),
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
