const express = require("express");
const router = express.Router();
const uploadProdukFile = require("../middleware/upload");
const { getAllProduk, createProduk, getProdukById, updateProduk, deleteProduk } = require("../controllers/prodController");

router.get("/", getAllProduk);
router.put("/:id", uploadProdukFile, updateProduk);
router.delete("/:id", deleteProduk);
router.get("/:id", getProdukById);
router.post("/", uploadProdukFile, createProduk);

module.exports = router;