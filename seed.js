require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Your 28 products (same as in your frontend)
const products = [
  { id: 1, name: "Leather Weekender Bag", category: "Bags", price: 4480, img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&auto=format", trending: true },
  { id: 2, name: "Minimalist Wristwatch", category: "Accessories", price: 3400, img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format", trending: true },
  { id: 3, name: "Oversized Blazer", category: "Clothing", price: 2860, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format" },
  { id: 4, name: "Silk Scarf", category: "Accessories", price: 990, img: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&auto=format" },
  { id: 5, name: "Ceramic Coffee Set", category: "Home", price: 1600, img: "https://images.unsplash.com/photo-1517256064527-09ffc8da86aa?w=400&auto=format" },
  { id: 6, name: "Suede Chelsea Boots", category: "Footwear", price: 3580, img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&auto=format", trending: true },
  { id: 7, name: "Cashmere Sweater", category: "Clothing", price: 2320, img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&auto=format" },
  { id: 8, name: "Aromatherapy Diffuser", category: "Home", price: 810, img: "https://images.unsplash.com/photo-1608911873371-0e0b9b3ea4b1?w=400&auto=format" },
  { id: 9, name: "Slim Fit Chinos", category: "Clothing", price: 1250, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&auto=format", trending: true },
  { id: 10, name: "Leather Backpack", category: "Bags", price: 3890, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format" },
  { id: 11, name: "Wireless Earbuds", category: "Electronics", price: 1890, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format" },
  { id: 12, name: "Marble Cheese Board", category: "Home", price: 650, img: "https://images.unsplash.com/photo-1606728035289-d0b6d6dfe0e9?w=400&auto=format" },
  { id: 13, name: "Polarized Sunglasses", category: "Accessories", price: 1450, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format", trending: true },
  { id: 14, name: "High Top Sneakers", category: "Footwear", price: 2150, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&auto=format" },
  { id: 15, name: "Cotton Linen Shirt", category: "Clothing", price: 980, img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&auto=format" },
  { id: 16, name: "Smart Watch", category: "Electronics", price: 4250, img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&auto=format", trending: true },
  { id: 17, name: "Wool Fedora Hat", category: "Accessories", price: 890, img: "https://images.unsplash.com/photo-1520975661595-6453be3f1f7b?w=400&auto=format" },
  { id: 18, name: "Stainless Steel Bottle", category: "Home", price: 520, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format" },
  { id: 19, name: "Yoga Mat", category: "Sports", price: 750, img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&auto=format" },
  { id: 20, name: "Leather Wallet", category: "Accessories", price: 1190, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format" },
  { id: 21, name: "Bluetooth Speaker", category: "Electronics", price: 2790, img: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&auto=format" },
  { id: 22, name: "Knitted Beanie", category: "Clothing", price: 450, img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&auto=format" },
  { id: 23, name: "Desk Lamp", category: "Home", price: 890, img: "https://images.unsplash.com/photo-1507473885765-e6b057e9d589?w=400&auto=format" },
  { id: 24, name: "Running Shoes", category: "Footwear", price: 2990, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format", trending: true },
  { id: 25, name: "Graphic T-Shirt", category: "Clothing", price: 590, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format" },
  { id: 26, name: "Ceramic Mug Set", category: "Home", price: 380, img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&auto=format" },
  { id: 27, name: "Fitness Tracker", category: "Electronics", price: 1890, img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&auto=format" },
  { id: 28, name: "Canvas Tote Bag", category: "Bags", price: 650, img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&auto=format", trending: true }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB using the same URI as the backend
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Optional: Ask before deleting all products (for safety)
    const shouldClear = process.env.NODE_ENV !== 'production' || process.env.FORCE_SEED === 'true';
    if (shouldClear) {
      await Product.deleteMany();
      console.log('🗑️ Existing products removed');
    } else {
      console.log('⚠️ Skipping deletion – products already exist (set FORCE_SEED=true to override)');
    }

    // Remove the temporary `id` field (MongoDB will generate its own `_id`)
    const productsToInsert = products.map(({ id, ...rest }) => rest);

    // Insert only if the collection is empty (or after deletion)
    const count = await Product.countDocuments();
    if (count === 0) {
      const inserted = await Product.insertMany(productsToInsert);
      console.log(`✅ Inserted ${inserted.length} products`);
    } else {
      console.log(`ℹ️ Database already contains ${count} products – no changes made.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();