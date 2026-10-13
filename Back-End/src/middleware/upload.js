const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/products");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|webp/;

    const extension = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedExtensions.test(file.mimetype);

    if (extension && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Format gambar harus JPG, JPEG, PNG, atau WEBP"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;