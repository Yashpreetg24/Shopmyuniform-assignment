require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const categoriesRoutes = require('./routes/categories');
app.use('/api/categories', categoriesRoutes);

const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const ordersRoutes = require('./routes/orders');
app.use('/api/orders', ordersRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
