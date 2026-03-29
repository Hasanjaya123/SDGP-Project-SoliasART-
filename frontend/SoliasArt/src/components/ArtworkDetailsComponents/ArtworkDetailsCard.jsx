import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, paymentService } from '../../services/uploadApi';

//import icons
import { FiEye, FiHeart, FiBookmark } from 'react-icons/fi'; 
import { FaHeart, FaBookmark } from 'react-icons/fa'; 
import { MdOutlineViewInAr } from 'react-icons/md';

const ArtworkDetailsCard = ({ artwork, artist,liveLikesCount, onArClick, onSaveClick, isSaved }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize the navigation hook
  const navigate = useNavigate(); 


  const handleAddToCart = async () => {
    const token = localStorage.getItem('token'); // Get your saved JWT

    if (!token) {
      alert("Please log in first!");
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Send the POST request to backend
      await api.post('/api/cart/add', {
        artwork_id: artwork.id 
      });

      // If successful navigate to cart page
      navigate('/cart'); 
      
    } catch (error) {
      error.message = error.response?.data?.detail || error.message;
      console.error("Cart Error:", error);
      alert(error.message); 
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Please log in first!");
    return;
  }

  setIsProcessing(true);

  try {
    // Call backend to get payment details for this artwork
    const paymentData = await paymentService.initiatePayment([String(artwork.id)]);

    // Log the received payment data for debugging
    console.log("Payment Data Received:", paymentData);

    // Map the backend response to PayHere's expected format
    const payment = {
      sandbox: true, // true for testing
      merchant_id: paymentData.merchant_id,
      return_url: paymentData.return_url,
      cancel_url: paymentData.cancel_url,
      notify_url: paymentData.notify_url,
      order_id: paymentData.order_id,
      items: paymentData.items,
      amount: paymentData.amount,
      currency: paymentData.currency,
      hash: paymentData.hash,
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address,
      city: paymentData.city,
      country: paymentData.country,
    };

    // Verify merchant_id is actually there before starting
    if (!payment.merchant_id) {
      console.error("Data mapping error. Response keys:", Object.keys(paymentData));
      throw new Error("Merchant ID is missing from server response.");
    }

    // Set up PayHere callbacks
    window.payhere.onCompleted = async (orderId) => {
      try {
        await paymentService.confirmPayment(orderId);
        alert('Purchase successful!');
        navigate('/orders');
      } catch (err) {
        alert('Payment processed, but record update failed.');
      }
    };

    window.payhere.onDismissed = () => console.log("Payment dismissed.");
    window.payhere.onError = (err) => alert('Payment failed: ' + err);

    // Start the process
    window.payhere.startPayment(payment);

  } catch (error) {
    console.error("Checkout Error:", error);
    alert(error.response?.data?.detail || error.message || "Checkout failed");
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      
      {/* Category */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
          {artwork.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="!text-2xl lg:!text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-2">
        {artwork.title}
      </h1>
      
      {/* Artist Profile */}
      <Link 
        to={`/artist/profile/${artist.id}`}
        className="flex items-center gap-4 mb-2  rounded-lg dark:border-gray-800 w-max pr-6  transition-colors group cursor-pointer"
      >
        <img 
          src={artist.profileImageUrl} 
          alt={artist.name} 
          className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" 
        />
        <div className="flex flex-col">
          
          <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:underline underline-offset-2">
            {artist.name}
          </span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
            {artist.location}
          </span>
        </div>
      </Link>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 mb-8">
        <span className="flex items-center gap-1.5"><FiEye className="w-4 h-4" /> {artwork.views.toLocaleString()} Views</span>
        <span className="flex items-center gap-1.5"><FiHeart className="w-4 h-4" /> {liveLikesCount?.toLocaleString() || artwork.likes.toLocaleString()} Likes</span>
      
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-8 bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-1"><strong className="text-[10px] text-gray-400 uppercase tracking-wider">Medium</strong> <span className="font-medium">{artwork.medium}</span></div>
        <div className="flex flex-col gap-1"><strong className="text-[10px] text-gray-400 uppercase tracking-wider">Dimensions</strong> <span className="font-medium">{artwork.dimensions}</span></div>
        <div className="flex flex-col gap-1"><strong className="text-[10px] text-gray-400 uppercase tracking-wider">Year</strong> <span className="font-medium">{artwork.year}</span></div>
      </div>

      {/* Description */}
      <div className="mb-8 flex-grow">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2">Description</h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{artwork.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8 flex flex-col gap-1">
        <span className="text-xs text-gray-900 uppercase font-bold tracking-wide">Price</span>
        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          LKR {artwork.price.toLocaleString()}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 mt-auto">
        <div className="grid grid-cols-2 gap-3">
            
            {/*Add to Cart button */}
            <button 
              onClick={handleAddToCart} 
              disabled={isAddingToCart}
              className={`w-full py-3.5 text-white font-bold text-sm rounded-lg shadow-sm transition-all focus:!outline-none 
                ${isAddingToCart ? 'bg-amber-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 hover:!border-gray-200 dark:hover:!border-gray-800'}`}
            >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            {/*Buy Now button */}
            <button 
              onClick={handleBuyNow} 
              disabled={isProcessing}
              className={`w-full py-3.5 text-white font-bold text-sm rounded-lg shadow-sm transition-all focus:!outline-none 
                ${isProcessing ? 'bg-[#153654] cursor-not-allowed' : 'bg-[#153654] hover:bg-[#0F263B] hover:!border-gray-200 dark:hover:!border-gray-800'}`}
            >
                {isProcessing ? 'Processing...' : 'Buy Now'}
            </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
            
            {/*Save button */}
            <button onClick={onSaveClick} className="w-full py-3.5 bg-gray-200 dark:bg-gray-500 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white text-sm font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 transition-all flex items-center justify-center gap-2 hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
                {isSaved ? <FaBookmark className="w-4 h-4 text-slate-800 dark:text-white" /> : <FiBookmark className="w-4 h-4" />} {isSaved ? 'Saved' : 'Save Artwork'}
            </button>
            
            {/* AR button */}
            <button onClick={onArClick} className="w-full py-3.5 bg-blue-200 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-lg hover:bg-blue-300 dark:hover:bg-blue-900/60 transition-all flex items-center justify-center gap-2 hover:!border-gray-200 dark:hover:!border-gray-800 focus:!outline-none">
                <MdOutlineViewInAr className="w-5 h-5" /> Try in AR
            </button>
        </div>
      </div>

    </div>
  );
};

export default ArtworkDetailsCard;