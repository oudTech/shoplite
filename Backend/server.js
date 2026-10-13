require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration} ms`
    );
  });

  next();
});


function validateProduct(body) {
  const { name, price } = body;
  if (!name || price === undefined) {
    return 'name and price are required';
  }
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    return 'price must be a positive number';
  }
  return null;
}


function checkId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: `Invalid product id: ${req.params.id}` });
  }
  next();
}

app.get('/', (req, res) => {
  res.send('Server is alive and well');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/products/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to count products'
    });
  }
});


app.get('/products/:id', checkId, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: `Product with id ${req.params.id} not found` });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});



app.post('/products', async (req, res) => {
  const problem = validateProduct(req.body);

  if (problem) {
    return res.status(400).json({ error: problem });
  }

  try {
    const { name, price, category, image, stock } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      category,
      image,
      stock
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create product'
    });
  }
});


app.put('/products/:id', checkId, async (req, res) => {

  const problem = validateProduct(req.body);

  if (problem) {
    return res.status(400).json({ error: problem });
  }


  try {
    const { name, price, category, image, stock } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, image, stock },
      { new: true, runValidators: true }
    );

    
    if (!updated) {
      return res.status(404).json({
        error: `Product with id ${req.params.id} not found`
      });
    }

  
    res.status(200).json(updated);

  } catch (err) {

    console.error(err);
    res.status(500).json({
      error: 'Failed to update product'
    });
  }
});


app.delete('/products/:id', checkId, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: `Product with id ${req.params.id} not found`
      });
    }

    res.status(200).json(deleted);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to delete product'
    });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.status && err.status < 500 ? err.message : 'Internal server error'
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from the .env file');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();