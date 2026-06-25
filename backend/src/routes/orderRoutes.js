const express = require("express");
const {
  getOrders,
  createOrder
} = require("../controllers/orderController");

const { checkAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getOrders);
router.post("/", checkAuth, createOrder);

module.exports = router;