import React, { useState } from 'react';
import CartItem from '../components/CartComponents/CartItem'; 
import OrderSummary from '../components/CartComponents/OrderSummery'; 
import { motion, AnimatePresence } from 'framer-motion';

// mock data
const initialCartItems = [
  {
    id: "art-123",
    title: "test artwork",
    artist: "Kamal Perera",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "art-456",
    title: "Abstract",
    artist: "Nimal ",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=400&h=400"
  }
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  // remove art
  const handleRemoveItem = (idToRemove) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };

  // Calculate Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  const shipping = cartItems.length > 0 ? 50 : 0; 
  const tax = subtotal * 0.08; // 8% fake tax

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-16 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Your Shopping Cart ({cartItems.length} items)
        </h2>

        {cartItems.length === 0 ? (
          // empty cart
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your cart is completely empty.</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Discover unique artworks to add to your collection.</p>
            <a href="/" className="inline-block rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700">
              Browse Gallery
            </a>
          </div>
        ) : (
          // cart with items
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            
            {/* left - cartitem component */}
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl space-y-6">
                {/* to add animation */}
                <AnimatePresence>
                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout // below items slide up smoothly.
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}  
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} 
                            transition={{ duration: 0.3 }}
                        >
                            <CartItem 
                                            key={item.id} 
                                            item={item} 
                                            onRemove={handleRemoveItem} 
                                    />
                        </motion.div>
                    
              ))}
                </AnimatePresence>
              
            </div>

            {/* Right - orderSummery component */}
            <OrderSummary 
              subtotal={subtotal} 
              shipping={shipping} 
              tax={tax} 
            />

          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;