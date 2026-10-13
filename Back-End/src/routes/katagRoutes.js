const express = require("express");
const router = express.Router();
const { getAllKateg } = require("../controllers/KategController");

router.get("/", getAllKateg);
module.exports = router;