const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /api/products — list with optional filters
router.get('/', (req, res) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    result = result.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    result = result.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

  res.json({ products: result, total: result.length });
});

// GET /api/products/categories — list unique categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

// GET /api/products/:id — single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Find related products (same category, excluding self)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({ product, related });
});

module.exports = router;
