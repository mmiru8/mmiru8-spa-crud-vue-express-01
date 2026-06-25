const express = require("express");
const {
  getProducts,
  createProduct
} = require("../controllers/productController");

const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.post("/", checkAuth, createProduct);

module.exports = router;