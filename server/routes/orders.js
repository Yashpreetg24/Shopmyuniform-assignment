const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Use Prisma interactive transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Read cart
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });

      if (cartItems.length === 0) {
        throw new Error('CART_EMPTY');
      }

      let totalAmount = 0;
      const outOfStockItems = [];

      // 2. Verify stock
      for (const item of cartItems) {
        if (item.product.stockQuantity < item.quantity) {
          outOfStockItems.push({
            productId: item.productId,
            name: item.product.name,
            requested: item.quantity,
            available: item.product.stockQuantity
          });
        }
        totalAmount += item.product.price * item.quantity;
      }

      if (outOfStockItems.length > 0) {
        const error = new Error('STOCK_UNAVAILABLE');
        error.details = outOfStockItems;
        throw error;
      }

      // 3. Create order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price
            }))
          }
        },
        include: { items: true }
      });

      // 4. Decrement stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        });
      }

      // 5. Clear cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return createdOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.message === 'CART_EMPTY') {
      return res.status(400).json({ error: 'Cannot create order with an empty cart' });
    }
    if (error.message === 'STOCK_UNAVAILABLE') {
      return res.status(400).json({ error: 'Some items are out of stock', details: error.details });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
