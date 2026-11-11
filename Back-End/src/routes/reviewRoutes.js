const express = require("express");
const { getReviewsByProduct, createReview } = require("../controllers/reviewController");

const router = express.Router();

router.get("/produk/:id", getReviewsByProduct);
router.post("/", createReview);

module.exports = router;
