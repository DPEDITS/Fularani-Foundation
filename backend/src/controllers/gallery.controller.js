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
        uploadedBy: uploadedBy || "Anonymous",
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

const deleteGalleryItem = asyncHandler(async (req, res) => {
    const galleryItem = await GalleryItem.findByIdAndDelete(req.params.id).select(
        "-password -refreshToken",
    );
    if (!galleryItem) {
        throw new ApiError(500, "Something went wrong while deleting the gallery item");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, galleryItem, "Gallery item deleted Successfully"));
});

const getGalleryItemById = asyncHandler(async (req, res) => {
    const galleryItem = await GalleryItem.findById(req.params.id).select(
        "-password -refreshToken",
    );
    if (!galleryItem) {
        throw new ApiError(500, "Something went wrong while fetching the gallery item");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, galleryItem, "Gallery item fetched Successfully"));
});

const getAllGalleryItems = asyncHandler(async (req, res) => {
    const galleryItems = await GalleryItem.find().select(
        "-password -refreshToken",
    );
    if (!galleryItems) {
        throw new ApiError(500, "Something went wrong while fetching the gallery items");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, galleryItems, "Gallery items fetched Successfully"));
});

const updateGalleryItem = asyncHandler(async (req, res) => {
    const { title, category, uploadedBy, description } = req.body;
    
    const galleryItem = await GalleryItem.findById(req.params.id);
    if (!galleryItem) {
        throw new ApiError(404, "Gallery item not found");
    }

    const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;
    let imageUrl = galleryItem.imageUrl;

    if (imageUrlLocalPath) {
        const uploadedImage = await uploadOnCloudinary(imageUrlLocalPath);
        if (uploadedImage) {
            imageUrl = uploadedImage.url;
        }
    }

    const updatedGalleryItem = await GalleryItem.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title: title || galleryItem.title,
                category: category || galleryItem.category,
                description: description || galleryItem.description,
                uploadedBy: uploadedBy || galleryItem.uploadedBy,
                imageUrl: imageUrl
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedGalleryItem, "Gallery item updated Successfully"));
});

export { createGalleryItem, updateGalleryItem, getGalleryItemById, getAllGalleryItems, deleteGalleryItem };
