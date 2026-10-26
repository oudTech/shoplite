require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const requireAuth = require('./middleware/requireAuth');

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());



app.use((req, res, next) => {

  if (req.path === "/health") {
    return next();
  }

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});




function validateProduct(body) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return 'request body must be a JSON object';
  }

  const { name, price } = body;

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    price === undefined
  ) {
    return 'name and price are required';
  }

  if (
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
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
  const databaseConnected = mongoose.connection.readyState === 1;

  if (!databaseConnected) {
    return res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }

  res.status(200).json({
    status: 'ok',
    database: 'connected'
  });
});


app.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};


  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail.includes('@')) {
    return res.status(400).json({
      error: 'Please provide a valid email address'
    });
  }


  if (typeof password !== 'string' || !password) {
    return res.status(400).json({
      error: 'Password is required'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long'
    });
  }

  try {

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash
    });


    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({
        error: 'An account with this email already exists'
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Failed to create account'
    });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};


  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }


  if (typeof password !== 'string' || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }


  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });


    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }


    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Login failed'
    });
  }

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

app.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Failed to retrieve user'
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

    await mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'shoplite_day20'
});


    console.log('MongoDB connected successfully');
    console.log('Connected database:', mongoose.connection.name);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();