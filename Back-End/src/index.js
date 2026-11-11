const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const kategRoutes = require("./routes/katagRoutes");
const prodRoutes = require("./routes/prodRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/kategori", kategRoutes);
app.use("/api/produk", prodRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/review", reviewRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend API berjalan"
    });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const invalidImage = error.message === "Format gambar harus JPG, JPEG, PNG, atau WEBP";
    const status = error instanceof multer.MulterError
        ? error.code === "LIMIT_FILE_SIZE" ? 413 : 400
        : invalidImage ? 400 : 500;
    const message = status === 500 ? "Terjadi kesalahan pada server" : error.message;

    if (status === 500) {
        console.error("Unhandled API error:", error);
    }
    return res.status(status).json({ success: false, message });
});


app.listen(port, () => {
    console.log(`Server berjalan di port http://localhost:${port}`);
});