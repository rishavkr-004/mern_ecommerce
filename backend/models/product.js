const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"] 
  },
  price: { 
    type: Number, 
    required: [true, "Price is required"] 
  },
  // Changed from 'image' to 'img' to match your Home.js and ProductDetail.js
  img: { 
    type: String, 
    required: [true, "Image URL is required"] 
  },
  description: { 
    type: String, 
    default: "No description available for this product." 
  },
  category: { 
    type: String, 
    default: "Featured" 
  }
}, { timestamps: true }); // Adds 'createdAt' and 'updatedAt' automatically

module.exports = mongoose.model("Product", productSchema);