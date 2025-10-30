import express from 'express';
import Cart from '../models/Cart.js';
import { randomInt } from 'crypto';

const router = express.Router();

// POST /api/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);
    
    // Clear cart after checkout
    await Cart.deleteMany({});
    
    // Generate mock receipt
    const generate12DigitId = () => String(randomInt(1e11, 1e12));
    const receipt = {
      id: generate12DigitId(),
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

export default router;