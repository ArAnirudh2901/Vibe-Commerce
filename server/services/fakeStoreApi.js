import axios from 'axios';
import Product from '../models/Product.js';

const FAKE_STORE_API_URL = 'https://fakestoreapi.com';

// Fetch products from Fake Store API and save to database
export const syncProductsFromFakeStore = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_URL}/products`);
    const fakeStoreProducts = response.data;
    
    // Check if we need to sync products
    const count = await Product.countDocuments();
    if (count === 0) {
      // Transform Fake Store API products to match our schema
      const products = fakeStoreProducts.map(item => ({
        name: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        category: item.category
      }));
      
      await Product.insertMany(products);
      console.log('Products synced from Fake Store API');
      return products;
    }
    
    return null; // No sync needed
  } catch (error) {
    console.error('Error syncing products from Fake Store API:', error);
    throw error;
  }
};

// Fetch products from Fake Store API and return in our schema (no DB writes)
export const fetchFakeStoreProducts = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_URL}/products`);
    const fakeStoreProducts = response.data;
    return fakeStoreProducts.map(item => ({
      name: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category
    }));
  } catch (error) {
    console.error('Error fetching products from Fake Store API:', error);
    throw error;
  }
};

// Get product categories from Fake Store API
export const getProductCategories = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_URL}/products/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

// Get products by category from Fake Store API
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_URL}/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};