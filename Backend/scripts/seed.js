require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGODB_URI;

const products = [
{
   
    name: "Headphones",
    price: 25000,
    category: "Electronics",
    image: "images/head-phones.png",
    stock: 12,
  },
  {
   
    name: "Power bank",
    price: 10000,
    category: "Electronics",
    image: "images/powerbank.png",
    stock: 8,
  },
  {
  
    name: "Charger",
    price: 5000,
    category: "Electronics",
    image: "images/charger.png",
    stock: 2,
  },
  {
    
    name: "Phone case",
    price: 4000,
    category: "Electronics",
    image: "images/phone-case.png",
    stock: 2,
  },
  {
    
    name: "Earpods",
    price: 5000,
    category: "Electronics",
    image: "images/earpods.png",
    stock: 2,
  },
  {
   
    name: "Extension",
    price: 5000,
    category: "Electronics",
    image: "images/extension.png",
    stock: 2,
  },
  {
    
    name: "Modem",
    price: 5000,
    category: "Electronics",
    image: "images/router.png",
    stock: 2,
  },
   {
    
    name: "Tablet case",
    price: 5000,
    category: "Electronics",
    image: "images/tablet-case.png",
    stock: 2,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();