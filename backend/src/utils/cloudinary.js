import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "./logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    logger.info("Cloudinary upload success:", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    logger.error("Cloudinary upload error full details:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    logger.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
