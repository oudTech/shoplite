const express = require('express');
const PRODUCTS = require('./data/products');
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is alive and well');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/products', (req, res) => {
  res.status(200).json(PRODUCTS);
});
app.get('/products/count', (req, res) => {
res.status(200).json({ count: PRODUCTS.length });
});
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = PRODUCTS.find(product => product.id === id);

  if (!product) {
   return res.status(404).json({ error: "Product not found"});
  }else{
    res.status(200).json(product);
  }
 
});
app.post('/products', (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || !price  === undefined) {
  return res.status(400).json({error: "name and price are required"});
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
  return res.status(400).json({ error: "price must be a positive number" });
  }

  const newId = Math.max(...PRODUCTS.map(product => product.id)) + 1;
  const newProduct = {
  id: newId,
  name,
  price,
  category,
  stock
};
PRODUCTS.push(newProduct);
return res.status(201).json(newProduct);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});