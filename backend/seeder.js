const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Matches your file: backend/models/Product.js
const Product = require('./models/Product'); 
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  const products = [];

  // Ensure products.json.csv is in backend/data/
  fs.createReadStream('./data/products.json.csv')
    .pipe(csv())
    .on('data', (row) => {
      products.push({
        name: row.Title,
        category: row.Category,
        img: row['Image URL'], 
        price: Number(row.Price),
        originalPrice: Number(row['Original Price']) || 0,
        description: row['Key Features'],
        rating: Number(row.Rating) || 0,
        countInStock: 15
      });
    })
    .on('end', async () => {
      try {
        console.log('Clearing old products...');
        await Product.deleteMany(); 
        
        console.log('Importing electronic items...');
        await Product.insertMany(products);
        
        console.log(`✅ Success! ${products.length} Products Imported.`);
        process.exit();
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
    });
};

importData();