const Product = require("../models/Product"); // Ensure this matches your 'Product.js' filename

// @desc    Fetch all products (with optional category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    // Check if there is a category in the URL (e.g., /api/products?category=Mobile)
    const category = req.query.category;
    const filter = category ? { category: category } : {};

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
};