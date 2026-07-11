const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Demo users:
// User: user@demo.com / password123
// Admin: admin@demo.com / admin123

async function main() {
  console.log('Clearing old data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding categories...');
  const catShirts = await prisma.category.create({ data: { name: 'Shirts', slug: 'shirts' } });
  const catTrousers = await prisma.category.create({ data: { name: 'Trousers', slug: 'trousers' } });
  const catJackets = await prisma.category.create({ data: { name: 'Jackets', slug: 'jackets' } });
  const catFootwear = await prisma.category.create({ data: { name: 'Footwear', slug: 'footwear' } });

  console.log('Seeding products...');
  const products = [
    // Shirts
    { name: 'White Formal Shirt', description: 'Classic white shirt', price: 250000, stockQuantity: 50, size: 'M', categoryId: catShirts.id },
    { name: 'Blue Casual Shirt', description: 'Casual wear', price: 150000, stockQuantity: 100, size: 'L', categoryId: catShirts.id },
    { name: 'Black Slim Fit Shirt', description: 'Slim fit party wear', price: 300000, stockQuantity: 30, size: 'S', categoryId: catShirts.id },
    { name: 'Checkered Shirt', description: 'Red and black checks', price: 180000, stockQuantity: 80, size: 'XL', categoryId: catShirts.id },
    { name: 'Linen Summer Shirt', description: 'Breathable fabric', price: 350000, stockQuantity: 20, size: 'M', categoryId: catShirts.id },
    { name: 'Denim Shirt', description: 'Tough denim', price: 400000, stockQuantity: 40, size: 'L', categoryId: catShirts.id },
    { name: 'Floral Print Shirt', description: 'Beach wear', price: 200000, stockQuantity: 60, size: 'M', categoryId: catShirts.id },
    
    // Trousers
    { name: 'Navy Chinos', description: 'Comfortable chinos', price: 280000, stockQuantity: 90, size: '32', categoryId: catTrousers.id },
    { name: 'Khaki Pants', description: 'Regular fit', price: 220000, stockQuantity: 110, size: '34', categoryId: catTrousers.id },
    { name: 'Black Formal Trousers', description: 'Office wear', price: 320000, stockQuantity: 70, size: '32', categoryId: catTrousers.id },
    { name: 'Grey Wool Blend Trousers', description: 'Winter formal', price: 450000, stockQuantity: 25, size: '36', categoryId: catTrousers.id },
    { name: 'Slim Fit Jeans', description: 'Blue stretch', price: 350000, stockQuantity: 150, size: '30', categoryId: catTrousers.id },
    { name: 'Cargo Pants', description: 'Olive green', price: 260000, stockQuantity: 85, size: '34', categoryId: catTrousers.id },
    { name: 'Linen Trousers', description: 'Summer comfort', price: 300000, stockQuantity: 45, size: '32', categoryId: catTrousers.id },
    
    // Jackets
    { name: 'Leather Biker Jacket', description: 'Genuine leather', price: 1500000, stockQuantity: 15, size: 'L', categoryId: catJackets.id },
    { name: 'Denim Jacket', description: 'Classic blue', price: 600000, stockQuantity: 60, size: 'M', categoryId: catJackets.id },
    { name: 'Puffer Jacket', description: 'Winter wear', price: 850000, stockQuantity: 40, size: 'XL', categoryId: catJackets.id },
    { name: 'Bomber Jacket', description: 'Olive green bomber', price: 700000, stockQuantity: 50, size: 'M', categoryId: catJackets.id },
    { name: 'Windbreaker', description: 'Lightweight', price: 400000, stockQuantity: 100, size: 'L', categoryId: catJackets.id },
    { name: 'Fleece Jacket', description: 'Cozy and warm', price: 550000, stockQuantity: 75, size: 'S', categoryId: catJackets.id },
    
    // Footwear
    { name: 'Running Shoes', description: 'Lightweight sports', price: 600000, stockQuantity: 120, size: '10', categoryId: catFootwear.id },
    { name: 'Leather Oxfords', description: 'Formal wear', price: 1200000, stockQuantity: 30, size: '9', categoryId: catFootwear.id },
    { name: 'Canvas Sneakers', description: 'Everyday casual', price: 300000, stockQuantity: 200, size: '8', categoryId: catFootwear.id },
    { name: 'Hiking Boots', description: 'Tough terrain', price: 1800000, stockQuantity: 20, size: '11', categoryId: catFootwear.id },
    { name: 'Slip-on Loafers', description: 'Easy wear', price: 450000, stockQuantity: 80, size: '9', categoryId: catFootwear.id }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seeding users...');
  const userPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      email: 'user@demo.com',
      passwordHash: userPasswordHash,
      name: 'Demo User',
      role: 'USER'
    }
  });

  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      passwordHash: adminPasswordHash,
      name: 'Demo Admin',
      role: 'ADMIN'
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
