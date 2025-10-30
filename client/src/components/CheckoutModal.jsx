import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { checkout } from '../services/api';
import AnimatedBorderButton from './AnimatedBorderButton';

function CheckoutModal({ cart, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const receiptData = await checkout(cart.items);
      setReceipt(receiptData);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="relative overflow-hidden bg-black rounded-lg max-w-md w-full p-6 border border-gray-800">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div
              className="absolute -top-6 -left-6 w-[65%] h-[40%] blur-2xl"
              style={{
                background:
                  'radial-gradient(circle at top left, rgba(255,255,255,0.22), rgba(255,255,255,0.12), rgba(255,255,255,0) 50%)'
              }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-[65%] h-[40%] blur-2xl"
              style={{
                background:
                  'radial-gradient(circle at bottom right, rgba(255,255,255,0.22), rgba(255,255,255,0.12), rgba(255,255,255,0) 50%)'
              }}
            />
          </div>
          <div className="relative z-10">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Order Successful!</h2>

              <div className="rounded-lg p-4 mb-6 text-left border border-gray-800 bg-black/60">
                <h3 className="font-semibold text-white mb-2">Receipt</h3>
                <p className="text-sm text-gray-300 mb-1">Order ID: {receipt.id}</p>
                <p className="text-sm text-gray-300 mb-2">Date: {new Date(receipt.timestamp).toLocaleString()}</p>
                <p className="text-lg font-bold text-white">Total: ${receipt.total}</p>
              </div>

              <AnimatedBorderButton
                onClick={onSuccess}
                className="w-full bg-black text-white py-2 px-4"
              >
                Continue Shopping
              </AnimatedBorderButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden bg-black rounded-lg max-w-md w-full p-6 border border-gray-800 max-h-[90vh]"
        >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute -top-6 -left-6 w-[65%] h-[40%] blur-2xl"
            style={{
              background:
                'radial-gradient(circle at top left, rgba(255,255,255,0.22), rgba(255,255,255,0.12), rgba(255,255,255,0) 50%)'
            }}
          />
          <div
            className="absolute -bottom-8 -right-8 w-[65%] h-[40%] blur-2xl"
            style={{
              background:
                'radial-gradient(circle at bottom right, rgba(255,255,255,0.22), rgba(255,255,255,0.12), rgba(255,255,255,0) 50%)'
            }}
          />
        </div>
        <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{receipt ? 'Order Complete' : 'Checkout'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-white mb-2">Order Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-900 max-h-60 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm mb-1">
                <span className="text-gray-800">{item.productId.name} x{item.quantity}</span>
                <span className="text-gray-900">${(item.productId.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-gray-900">${cart.total}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your email address"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-[6px] hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <AnimatedBorderButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="flex-1 bg-black text-white py-2 px-4"
            >
              Place Order
            </AnimatedBorderButton>
          </div>
        </form>
        </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CheckoutModal;