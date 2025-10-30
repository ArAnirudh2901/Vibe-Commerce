import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

export const checkout = async (cartItems) => {
  const response = await api.post('/checkout', { cartItems });
  return response.data;
};

export const updateCartQuantity = async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};