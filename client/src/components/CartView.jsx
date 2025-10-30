import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { removeFromCart, updateCartQuantity } from '../services/api';
import AnimatedBorderButton from './AnimatedBorderButton';

function CartView({ cart, onCartUpdate, onCheckout }) {
  const [busyId, setBusyId] = useState(null);

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      onCartUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleIncrement = async (item) => {
    if (item.quantity >= 20) return; // cap at 20
    try {
      setBusyId(item._id);
      await updateCartQuantity(item._id, item.quantity + 1);
      onCartUpdate();
    } catch (error) {
      console.error('Error increasing quantity:', error);
    } finally {
      setBusyId(null);
    }
  };

  const handleDecrement = async (item) => {
    try {
      setBusyId(item._id);
      if (item.quantity <= 1) {
        await removeFromCart(item._id);
      } else {
        await updateCartQuantity(item._id, item.quantity - 1);
      }
      onCartUpdate();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    } finally {
      setBusyId(null);
    }
  };

  if (cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="text-center py-12"
      >
        <ShoppingBag className="h-16 w-16 text-white mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-white">Add some products to get started!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-3xl font-bold text-white">Shopping Cart</h2>
        <p className="text-gray-400">{cart.items.length} items</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
            {cart.items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-black rounded-lg shadow-md p-6 border border-gray-900"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="basis-1/2 max-w-[50%] min-w-0 pr-2">
                    <h3 className="text-lg font-semibold text-white truncate" title={item.productId.name}>{item.productId.name}</h3>
                    <p className="text-white font-bold">${item.productId.price}</p>
                  </div>

                  <div className="ml-auto flex items-center gap-5 w-[280px] sm:w-[300px] justify-end shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        aria-label="Decrease quantity"
                        title="Decrease quantity"
                        disabled={busyId === item._id}
                        onClick={() => handleDecrement(item)}
                        className="h-8 w-8 flex items-center justify-center rounded-[6px] border border-gray-800 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-white tabular-nums">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        title="Increase quantity"
                        disabled={busyId === item._id || item.quantity >= 20}
                        onClick={() => handleIncrement(item)}
                        className="h-8 w-8 flex items-center justify-center rounded-[6px] border border-gray-800 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="w-28 sm:w-32 flex items-baseline justify-center text-center text-white font-bold">
                      <span className="text-lg">$</span>
                      <span className="text-lg tabular-nums pl-1">{(item.productId.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="w-8 h-8 grid place-items-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
            className="bg-black rounded-lg shadow-md p-6 sticky top-4 border border-gray-900"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-white">Subtotal</span>
                <span className="font-semibold text-white">${cart.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Shipping</span>
                <span className="font-semibold text-green-400">Free</span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-white">${cart.total}</span>
              </div>
            </div>

            <AnimatedBorderButton
              onClick={onCheckout}
              className="w-full bg-black text-white py-3 px-4"
            >
              Proceed to Checkout
            </AnimatedBorderButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartView;