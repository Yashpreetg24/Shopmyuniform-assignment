const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'ProductId is required' });

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } }
    });

    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const item = await prisma.wishlist.create({
      data: { userId: req.user.id, productId }
    });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    await prisma.wishlist.delete({
      where: { userId_productId: { userId: req.user.id, productId } }
    });

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    // Prisma throws P2025 if not found
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not in wishlist' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
