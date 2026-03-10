import React, { useState, useEffect } from 'react';
import CartItem from '../components/CartComponents/CartItem'; 
import OrderSummary from '../components/CartComponents/OrderSummery'; 
import { motion, AnimatePresence } from 'framer-motion';

// mock data
// const initialCartItems = [
//   {
//     id: "art-123",
//     title: "test artwork",
//     artist: "Kamal Perera",
//     price: 1200,
//     imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400&h=400"
//   },
//   {
//     id: "art-456",
//     title: "Abstract",
//     artist: "Nimal ",
//     price: 850,
//     imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=400&h=400"
//   }
// ];

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserId = "6362a1a3-0844-4038-9c02-974247c5af28";

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        
        const response = await fetch(`http://localhost:8000/api/cart/${currentUserId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCartItems(data); 
        
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUserId]);

  // remove art
  const handleRemoveItem = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cart/remove/${cartItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete item from database");
      }

      //  remove art from the cart
      setCartItems((prevItems) => prevItems.filter(item => item.id !== cartItemId));
      
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Could not remove item. Please try again.");
    }
  };

  // Calculate Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = cartItems.length > 0 ? 50 : 0; 

  // loading ui
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 pt-12 md:pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79]"></div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-16 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-8 md:px-12 lg:px-16">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Your Shopping Cart ({cartItems.length} items)
        </h2>

        {cartItems.length === 0 ? (
          // empty cart
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cart is empty.</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Discover unique artworks to add to your collection.</p>
            <a 
              href="/explore" 
              className="inline-block px-8 py-3.5 bg-amber-500 !text-white font-bold text-sm rounded-lg shadow-sm hover:bg-amber-600 transition-all hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
              Explore
            </a>
          </div>
        ) : (
          // cart with items
          <div className="mt-6 sm:mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 xl:gap-10">
            
            {/* left - cartitem component */}
            <div className="w-full space-y-6 lg:col-span-7 xl:col-span-8">
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
            <div className="w-full mt-6 lg:col-span-5 xl:col-span-4 lg:mt-0">
            <OrderSummary 
              subtotal={subtotal} 
              shipping={shipping} 
            />
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;