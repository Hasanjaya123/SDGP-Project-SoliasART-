import React from 'react';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        
        {/* Artwork Image */}
        <a href="#" className="shrink-0 md:order-1">
          <img 
            className="h-20 w-20 rounded object-cover" 
            src={item.imageUrl} 
            alt={item.title} 
          />
        </a>

        {/* Price */}
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              ${item.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
            {item.title} by <span className="text-gray-500 dark:text-gray-400">{item.artist}</span>
          </a>

          <div className="flex items-center gap-4">
            {/* Favorites Button */}
            <button type="button" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
              </svg>
              Move to Favorites
            </button>

            {/* Remove Button */}
            <button 
              onClick={() => onRemove(item.id)} 
              type="button" 
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
            >
              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
              Remove
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CartItem;