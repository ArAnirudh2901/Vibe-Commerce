import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import ProductGrid from './components/ProductGrid';
import CartView from './components/CartView';
import Landing from './components/Landing';
import CheckoutModal from './components/CheckoutModal';
import { getProducts, getCart } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  // Lock body scroll when checkout modal is open
  useEffect(() => {
    if (showCheckout) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showCheckout]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header with glassmorphism effect */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              type="button"
              aria-label="Go to landing"
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <Package className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Vibe Commerce</h1>
            </button>
            
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => setCurrentView('landing')}
                className={`font-medium ${currentView === 'landing' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('products')}
                className={`font-medium ${currentView === 'products' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Products
              </button>
              
              <button
                onClick={() => setCurrentView('cart')}
                className={`font-medium flex items-center space-x-2 ${currentView === 'cart' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-white text-black rounded-full h-7 w-7 flex items-center justify-center text-[10px] font-semibold leading-none">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Subtle white corner gradients (global, a touch stronger) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-[60vw] h-[60vh] blur-3xl"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(255,255,255,0.34), rgba(255,255,255,0.18), rgba(255,255,255,0) 50%)'
          }}
        />
        <div
          className="absolute top-0 right-0 w-[60vw] h-[60vh] blur-3xl"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(255,255,255,0.30), rgba(255,255,255,0.18), rgba(255,255,255,0) 50%)'
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[60vw] h-[60vh] blur-3xl"
          style={{
            background:
              'radial-gradient(circle at bottom left, rgba(255,255,255,0.30), rgba(255,255,255,0.18), rgba(255,255,255,0) 50%)'
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[60vw] h-[60vh] blur-3xl"
          style={{
            background:
              'radial-gradient(circle at bottom right, rgba(255,255,255,0.34), rgba(255,255,255,0.18), rgba(255,255,255,0) 50%)'
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'cart' && (
          <button 
            onClick={() => setCurrentView('products')}
            className="flex items-center space-x-2 mb-6 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-[6px] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </button>
        )}

        {currentView === 'landing' ? (
          <Landing onShop={() => setCurrentView('products')} />
        ) : currentView === 'products' ? (
          <ProductGrid products={products} cartItems={cart.items} onCartUpdate={loadCart} />
        ) : (
          <CartView 
            cart={cart} 
            onCartUpdate={loadCart}
            onCheckout={() => setShowCheckout(true)}
          />
        )}
      </main>
      
      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            loadCart();
            setCurrentView('products');
          }}
        />
      )}
    </div>
  );
}

export default App;