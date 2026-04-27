const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, "Price is required"],
    default: 0
  },
  // Added to show "Discount %" and "Crossed out price" like Flipkart
  originalPrice: { 
    type: Number 
  },
  // 'img' matches your existing frontend logic
  img: { 
    type: String, 
    required: [true, "Image URL is required"] 
  },
  // This will store the 'Key Features' string from your CSV
  description: { 
    type: String, 
    default: "No description available for this product." 
  },
  category: { 
    type: String, 
    required: true,
    enum: ["Mobile", "Laptop", "Audio", "Featured"], // Ensures data consistency
    default: "Featured" 
  },
  // Added for Star Ratings in your Glassmorphism cards
  rating: { 
    type: Number, 
    default: 0 
  },
  // Added for "Reviews" count social proof
  numReviews: { 
    type: Number, 
    default: 0 
  },
  // Added for "Add to Cart" logic and stock status
  countInStock: { 
    type: Number, 
    required: true, 
    default: 10 
  },
  // Optional: To store the specific brand (Samsung, Apple, etc.)
  brand: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);