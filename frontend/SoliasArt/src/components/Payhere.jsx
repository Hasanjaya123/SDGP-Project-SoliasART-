import { api } from '../services/uploadApi';

export default function CheckoutButton({ artworkId, buyerId, address, phone }) {
  
  const handlePayment = async () => {
    try {
      
      const response = await api.post("/api/checkout/initialize", {
        artwork_id: artworkId,
        buyer_id: buyerId,
        shipping_address: address,
        contact_number: phone
      });

      const config = response.data.payhere_config;
      
     
      const frontendUrl = window.location.origin; 
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const paymentObject = {
        sandbox: true, 
        merchant_id: config.merchant_id,
        
     
        return_url: `${frontendUrl}/payment-success`,
        cancel_url: `${frontendUrl}/payment-cancel`,
        
      
        notify_url: `${backendUrl}/api/payment/webhook`, 
        
        order_id: config.order_id,
        items: config.items,
        amount: config.amount,
        currency: config.currency,
        hash: config.hash, 
        
  
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: phone,
        address: address,
        city: "Colombo",
        country: "Sri Lanka"
      };

      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        window.location.href = `/order-success?order=${orderId}`;
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        console.log("Error:" + error);
        alert("Payment failed. Please try again.");
      };

      window.payhere.startCheckout(paymentObject);

    } catch (error) {
      console.error("Could not initialize payment", error);
      alert(error.response?.data?.detail || "Checkout error.");
    }
  };

  return (
    <button onClick={handlePayment} className="bg-black text-white px-6 py-3 rounded w-full">
      Pay with PayHere
    </button>
  );
}