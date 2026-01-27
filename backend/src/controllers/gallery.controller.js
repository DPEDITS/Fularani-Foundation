import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GalleryItem } from "../models/galleryItem.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createGalleryItem = asyncHandler(async (req, res) => {
    const { title, category, uploadedBy, description } = req.body;
    if (!title || !category  || !description) {
        throw new ApiError(400, "All fields are required");
    }
    const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;
    let imageUrl;
    if (imageUrlLocalPath) {
        imageUrl = await uploadOnCloudinary(imageUrlLocalPath);
    }
    if(!imageUrl){
        throw new ApiError(400, "Image is required");
    }
    const galleryItem = await GalleryItem.create({
        title,
        category,
        imageUrl: imageUrl?.url || "",
        uploadedBy: uploadedBy || "",
        description,
    });
    const createdGalleryItem = await GalleryItem.findById(galleryItem._id).select(
        "-password -refreshToken",
    );
    if (!createdGalleryItem) {
        throw new ApiError(500, "Something went wrong while creating the gallery item");
    }
    return res
        .status(201)
        .json(new ApiResponse(200, createdGalleryItem, "Gallery item created Successfully"));
});

export { createGalleryItem };
