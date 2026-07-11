const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) return res.status(400).json({ error: 'ProductId is required' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId: req.user.id, productId }
      }
    });

    const newQuantity = existingCartItem ? existingCartItem.quantity + quantity : quantity;

    if (product.stockQuantity < newQuantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: { userId: req.user.id, productId }
      },
      update: { quantity: newQuantity },
      create: { userId: req.user.id, productId, quantity }
    });

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return res.json({ message: 'Item removed from cart' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    });

    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    if (cartItem.product.stockQuantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });

    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    if (cartItem.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.cartItem.delete({ where: { id: itemId } });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
