import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/cart
router.get('/cart', async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId');
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);
    
    res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart
router.post('/cart', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    // Ensure we always work with a valid ObjectId for comparisons
    let productObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    // Sanity: quantity must be >= 1
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    
    // Verify product exists
    const product = await Product.findById(productObjectId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Enforce a max quantity of 20 per item
    const existing = await Cart.findOne({ productId: productObjectId });
    let updatedItem;
    if (existing) {
      const newQty = Math.min(existing.quantity + qty, 20);
      existing.quantity = newQty;
      await existing.save();
      updatedItem = await existing.populate('productId');
    } else {
      const newItem = new Cart({ productId: productObjectId, quantity: Math.min(qty, 20) });
      await newItem.save();
      updatedItem = await newItem.populate('productId');
    }

    return res.json(updatedItem);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// DELETE /api/cart/:id
router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Cart.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const q = Number(quantity);
    if (!Number.isFinite(q)) {
      return res.status(400).json({ error: 'Quantity must be a number' });
    }
    // Clamp between 1 and 20
    const clamped = Math.min(Math.max(q, 1), 20);
    
    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity: clamped },
      { new: true }
    ).populate('productId');
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

export default router;