const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// 1. GET ALL PRODUCTS (Used for the Home Page grid)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// 2. GET SINGLE PRODUCT BY ID (CRITICAL: This fixes "Product Not Found")
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found in database" });
    }
    res.json(product);
  } catch (err) {
    // This catches invalid MongoDB ID formats
    res.status(400).json({ message: "Invalid Product ID format", error: err.message });
  }
});

// 3. ADD PRODUCT (Used for Admin or testing)
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Error creating product", error: err.message });
  }
});

module.exports = router;
