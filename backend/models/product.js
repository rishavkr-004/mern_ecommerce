const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
});

module.exports = mongoose.model("product", productSchema);