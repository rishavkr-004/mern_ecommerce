const express = require("express");
const router = express.Router();
const Product = require("../models/product"); // Double-check: ensure it's 'Product' with capital P

// 1. GET ALL PRODUCTS (Enhanced with Category & Search Filters)
// GET /api/products or /api/products?category=Mobile or /api/products?keyword=samsung
router.get("/", async (req, res) => {
  try {
    const { category, keyword } = req.query;

    let query = {};

    // Filter by Category if provided
    if (category) {
      query.category = category;
    }

    // Filter by Search Keyword (Partial match, case-insensitive)
    if (keyword) {
      query.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// 2. GET SINGLE PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found in database" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid Product ID format", error: err.message });
  }
});

// 3. GET PRODUCTS BY CATEGORY (Alternative dedicated route)
// GET /api/products/category/Mobile
router.get("/category/:categoryName", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category items", error: err.message });
  }
});

module.exports = router;