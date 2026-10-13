const express = require("express");
const cors = require("cors");
require("dotenv").config();

const kategRoutes = require("./routes/katagRoutes");
const prodRoutes = require("./routes/prodRoutes");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/kategori", kategRoutes);
app.use("/api/produk", prodRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend API berjalan"
    });
});


app.listen(port, () => {
    console.log(`Server berjalan di port http://localhost:${port}`);
});