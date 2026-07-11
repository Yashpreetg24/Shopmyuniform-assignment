const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
const prisma = new PrismaClient();

router.use(auth, requireAdmin);

// CATEGORIES CRUD
router.post('/categories', async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    
    const category = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Category with this name or slug already exists' });
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, slug }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// PRODUCTS CRUD
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, images, stockQuantity, size, categoryId } = req.body;
    if (!name || !price || !categoryId) return res.status(400).json({ error: 'Name, price, and categoryId are required' });

    const product = await prisma.product.create({
      data: { name, description, price, images, stockQuantity, size, categoryId }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, images, stockQuantity, size, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, description, price, images, stockQuantity, size, categoryId }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
