const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { getAllProduk,createProduk } = require("../controllers/prodController");

router.get("/", getAllProduk);
router.post(
    "/",
    upload.single("gambar_produk"),
    createProduk
);
module.exports = router;