// =============================================
// routes/products.js
// =============================================
const express = require('express');
const router  = express.Router();
const { products } = require('../models/db');

// GET /api/products - Sabhi products (filter & search support)
router.get('/', (req, res) => {
  let result = [...products];
  const { category, search, minPrice, maxPrice, sort } = req.query;

  if (category) {
    result = result.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

  if (sort === 'price_asc')  result.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);

  res.json({
    count: result.length,
    products: result
  });
});

// GET /api/products/categories - All unique categories
router.get('/categories', (req, res) => {
  const cats = [...new Set(products.map(p => p.category))];
  res.json({ categories: cats });
});

// GET /api/products/:id - Single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product nahi mila' });
  }
  res.json(product);
});

module.exports = router;
