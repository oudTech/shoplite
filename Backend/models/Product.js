const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true, min: [0.01, 'Price must be positive'] },
  category: String,
  image:    String,
  stock:    { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);