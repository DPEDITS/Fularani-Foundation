import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const isImage =
    allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) &&
    allowedImageTypes.test(file.mimetype);

  // Allow markdown files for content uploads
  const isMarkdown =
    path.extname(file.originalname).toLowerCase() === ".md" ||
    file.mimetype === "text/markdown" ||
    file.mimetype === "application/octet-stream";

  if (isImage || isMarkdown) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only images and markdown files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
