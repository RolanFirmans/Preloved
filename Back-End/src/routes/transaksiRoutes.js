const express = require("express");
const { createTransaksi } = require("../controllers/transaksiController");

const router = express.Router();

router.post("/", createTransaksi);

module.exports = router;
