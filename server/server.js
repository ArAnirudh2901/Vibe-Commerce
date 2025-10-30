import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { syncProductsFromFakeStore, fetchFakeStoreProducts } from './services/fakeStoreApi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', checkoutRoutes);
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Ensure carts collection has no obsolete unique index on sessionId
    (async () => {
      try {
        const db = mongoose.connection.db;
        const hasCarts = await db.listCollections({ name: 'carts' }).toArray();
        if (hasCarts.length) {
          try {
            await db.collection('carts').dropIndex('sessionId_1');
            console.log('Dropped obsolete index sessionId_1 on carts');
          } catch (err) {
            // Ignore if index does not exist
            if (err && err.codeName !== 'IndexNotFound') {
              console.warn('Index cleanup warning:', err.message);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to inspect/drop carts indexes:', err.message);
      }
    })();
    // Use Fake Store API to seed products and ensure minimum count
    syncProductsFromFakeStore()
      .then(async (products) => {
        if (!products) {
          // If no products from API, use fallback seeding
          await seedProducts();
        }
        await ensureMinimumProducts(20);
        await replaceUnsplashWithFakeStore();
      })
      .catch(async (error) => {
        console.error('Error syncing products from Fake Store API:', error);
        // Fallback to local seeding if API fails
        await seedProducts();
        await ensureMinimumProducts(20);
        // Try to replace any placeholder/unsplash images with Fake Store ones if available
        await replaceUnsplashWithFakeStore();
      });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Fallback seed function
import Product from './models/Product.js';

async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        { name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80' },
        { name: 'Smartphone', price: 699.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80' },
        { name: 'Laptop', price: 1299.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80' },
        { name: 'Coffee Maker', price: 149.99, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80' },
        { name: 'Running Shoes', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80' },
        { name: 'Backpack', price: 79.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80' },
        { name: 'Watch', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80' },
        { name: 'Camera', price: 899.99, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&q=80' }
      ];
      
      await Product.insertMany(products);
      console.log('Products seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Ensure a minimum number of products exist (top-up seeding)
async function ensureMinimumProducts(minCount = 20) {
  try {
    const count = await Product.countDocuments();
    if (count < minCount) {
      const needed = minCount - count;
      const moreProducts = [
        { name: 'Mechanical Keyboard', price: 119.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80', description: 'Tactile switches and sturdy build.', category: 'electronics' },
        { name: 'USB-C Hub', price: 39.99, image: 'https://images.unsplash.com/photo-1555617117-08fda9b86ea3?w=400&h=400&fit=crop&q=80', description: 'Expand your laptop ports easily.', category: 'accessories' },
        { name: 'Noise Cancelling Earbuds', price: 89.99, image: 'https://images.unsplash.com/photo-1518443893430-bbb00e409013?w=400&h=400&fit=crop&q=80', description: 'Immersive sound on the go.', category: 'electronics' },
        { name: 'Portable SSD', price: 149.99, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop&q=80', description: 'Fast external storage.', category: 'electronics' },
        { name: '4K Monitor', price: 399.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80', description: 'Crisp visuals for work and play.', category: 'electronics' },
        { name: 'Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80', description: 'Track fitness and stay connected.', category: 'wearables' },
        { name: 'Wireless Charger', price: 29.99, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&q=80', description: 'Convenient Qi charging pad.', category: 'accessories' },
        { name: 'Fitness Tracker', price: 59.99, image: 'https://images.unsplash.com/photo-1518623489647-4db959c981be?w=400&h=400&fit=crop&q=80', description: 'Monitor activity and health.', category: 'wearables' },
        { name: 'Action Camera', price: 249.99, image: 'https://images.unsplash.com/photo-1519181245277-cffeb31da2a1?w=400&h=400&fit=crop&q=80', description: 'Capture adventures in 4K.', category: 'electronics' },
        { name: 'Drone', price: 599.99, image: 'https://images.unsplash.com/photo-1523961131990-5ea7d99bb13e?w=400&h=400&fit=crop&q=80', description: 'Aerial photography made easy.', category: 'electronics' },
        { name: 'Desk Lamp', price: 39.99, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop&q=80', description: 'Minimal LED lamp with dimmer.', category: 'home' },
        { name: 'Laptop Stand', price: 49.99, image: 'https://images.unsplash.com/photo-1611185974273-3f182a6469ee?w=400&h=400&fit=crop&q=80', description: 'Ergonomic aluminum stand.', category: 'accessories' },
      ];
      const toInsert = moreProducts.slice(0, needed);
      if (toInsert.length > 0) {
        await Product.insertMany(toInsert);
        console.log(`Top-up seeded ${toInsert.length} products to reach ${minCount}.`);
      }
    }
  } catch (error) {
    console.error('Error ensuring minimum products:', error);
  }
}

// Replace placeholder/unsplash images with real images from Fake Store API
async function replaceUnsplashWithFakeStore() {
  try {
    const stale = await Product.find({ image: { $regex: '(images\\.unsplash\\.com|placehold\\.co)' } });
    if (!stale.length) return;

    const fsProducts = await fetchFakeStoreProducts();
    if (!fsProducts || !fsProducts.length) return;

    let replaced = 0;
    for (let i = 0; i < stale.length; i++) {
      const data = fsProducts[i % fsProducts.length];
      await Product.findByIdAndUpdate(stale[i]._id, {
        name: data.name,
        price: data.price,
        image: data.image,
        description: data.description,
        category: data.category,
      }, { new: true });
      replaced++;
    }
    console.log(`Replaced ${replaced} products with Fake Store images/data.`);
  } catch (error) {
    console.warn('Failed to replace images with Fake Store data:', error.message);
  }
}

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});