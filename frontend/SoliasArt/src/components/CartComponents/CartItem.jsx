import React from 'react';
import { FiTrash2 } from "react-icons/fi";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex items-start gap-4 md:gap-6">
            
            {/* Artwork Image */}
            <a href="#" className="shrink-0">
            <img 
                className="h-20 w-20 rounded object-cover" 
                src={item.imageUrl} 
                alt={item.title} 
            />
            </a>

            {/* Artwork details and remove btn */}
            <div className="flex flex-1 justify-between gap-4">
            
            {/* Artwork name and artist  */}
            <div className="mt-2 flex flex-col min-w-0">
                <a href="#" className="text-xl font-medium !text-gray-900 hover:underline dark:text-white">
                {item.title}  <span className="text-sm text-gray-500 dark:text-gray-400"> by {item.artist}</span>
                </a>

                <div className="mt-2 flex items-center">
                <button 
                    onClick={() => onRemove(item.id)} 
                    type="button" 
                    className="inline-flex items-center text-sm font-medium text-red-300 transition-colors bg-transparent !border-none !outline-none !p-0 hover:text-red-600 hover:!bg-transparent hover:!border-transparent focus:!outline-none focus:!ring-0 dark:text-red-500 dark:hover:text-red-400"
                >
                <FiTrash2 className="me-1.5 h-5 w-5" aria-hidden="true" />
                    Remove
                </button>
                </div>
            </div>

            <div className="text-right shrink-0">
                <p className="text-base font-bold text-gray-900 dark:text-white">
                ${item.price.toLocaleString()}
                </p>
            </div>

            </div>
        </div>
    </div>
  );
};

export default CartItem;