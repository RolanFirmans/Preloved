const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.resolve(__dirname, "../../uploads/products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
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

// Langsung Ekspor fungsinya (bukan dalam bentuk objek)
const uploadFiles = upload.fields([
    { name: 'gambar_produk', maxCount: 1 },
    { name: 'galeri', maxCount: 4 }
]);

const uploadProdukFile = (req, res, next) => {
    uploadFiles(req, res, (error) => {
        if (!error) {
            return next();
        }

        const files = Object.values(req.files || {}).flat();
        Promise.allSettled(files.map((file) =>
            fs.promises.unlink(path.join(uploadDirectory, path.basename(file.filename)))
        )).then((results) => {
            results
                .filter((result) => result.status === "rejected" && result.reason.code !== "ENOENT")
                .forEach((result) => console.error("Gagal membersihkan upload yang ditolak:", result.reason));
            next(error);
        });
    });
};

module.exports = uploadProdukFile;