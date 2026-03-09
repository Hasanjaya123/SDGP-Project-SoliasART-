import React from 'react';
import { Link } from 'react-router-dom';

const OrderSummary = ({ subtotal, shipping, tax }) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Artwork Subtotal</dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">${subtotal.toLocaleString()}</dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Shipping Estimate</dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">${shipping.toLocaleString()}</dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Estimated Tax</dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">${tax.toLocaleString()}</dd>
            </dl>
          </div>

          <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">${total.toLocaleString()}</dd>
          </dl>
        </div>

        {/* Checkout btn */}
        <button className="flex w-full items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800 transition-colors">
          Proceed to Checkout
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
          {/* continue shopping */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 underline hover:no-underline dark:text-orange-500 transition-colors">
            Continue Shopping
            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;