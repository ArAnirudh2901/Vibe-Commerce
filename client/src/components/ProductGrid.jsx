import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { addToCart, removeFromCart, updateCartQuantity } from '../services/api';

function ProductGrid({ products, cartItems = [], onCartUpdate }) {
  const [busyId, setBusyId] = useState(null);

  const cartIndexByProductId = useMemo(() => {
    const map = new Map();
    for (const item of cartItems) {
      if (item?.productId?._id) {
        map.set(item.productId._id, item);
      }
    }
    return map;
  }, [cartItems]);

  const getCartItem = (productId) => cartIndexByProductId.get(productId);

  const handleAddToCart = async (productId) => {
    try {
      setBusyId(productId);
      await addToCart(productId, 1); // increments existing or adds new
      onCartUpdate();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setBusyId(null);
    }
  };

  const handleIncrement = async (productId) => {
    const item = getCartItem(productId);
    if (item && item.quantity >= 20) return; // cap at 20
    await handleAddToCart(productId);
  };

  const handleDecrement = async (productId) => {
    try {
      const item = getCartItem(productId);
      if (!item) return;
      setBusyId(productId);
      if (item.quantity <= 1) {
        await removeFromCart(item._id);
      } else {
        await updateCartQuantity(item._id, item.quantity - 1);
      }
      onCartUpdate();
    } catch (error) {
      console.error('Error decrementing cart item:', error);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Our Products</h2>
        <p className="text-gray-400">{products.length} items available</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product, idx) => {
          const item = getCartItem(product._id);
          const qty = item?.quantity || 0;
          const isBusy = busyId === product._id;
          return (
          <motion.div
            key={product._id}
            className="bg-black rounded-lg shadow-md overflow-hidden border border-gray-900 h-full flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.25, delay: idx * 0.03, ease: 'easeOut' }}
            whileHover={{ y: -3, scale: 1.01, boxShadow: '0 10px 24px rgba(255,255,255,0.05)' }}
          >
            <div className="overflow-hidden aspect-[4/3]">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 bg-[#0b0f19]"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400x400/0b0f19/ffffff?text=Image';
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
            
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="text-base font-semibold text-white mb-1 truncate" title={product.name}>{product.name}</h3>
              <p className="text-xl font-bold text-gray-300 mb-3">${product.price}</p>
              {qty > 0 ? (
                <div className="mt-auto w-full flex items-center justify-between bg-white text-black rounded-lg overflow-hidden text-sm">
                  <button
                    aria-label="Decrease quantity"
                    disabled={isBusy}
                    onClick={() => handleDecrement(product._id)}
                    className="py-1.5 px-3 hover:bg-gray-200 disabled:opacity-60"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="py-1.5 px-2 font-semibold select-none">{qty}</span>
                  <button
                    aria-label="Increase quantity"
                    disabled={isBusy || qty >= 20}
                    onClick={() => handleIncrement(product._id)}
                    className="py-1.5 px-3 hover:bg-gray-200 disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={isBusy}
                  className="mt-auto w-full bg-white text-black py-1.5 px-3 rounded-[6px] hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </motion.div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-white mx-auto mb-4" />
          <p className="text-white text-lg">No products available</p>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;