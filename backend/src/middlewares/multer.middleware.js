import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Organize temp files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|pdf|md|markdown)$/i;
    const allowedMimetypes =
      /image\/(jpeg|jpg|png|gif|webp)|application\/pdf|text\/(markdown|plain)|application\/octet-stream/;
    const extValid = allowedExtensions.test(path.extname(file.originalname));
    const mimeValid = allowedMimetypes.test(file.mimetype);

    if (extValid || mimeValid) {
      return cb(null, true);
    } else {
      cb(new Error("Error: File type not supported!"));
    }
  },
});
