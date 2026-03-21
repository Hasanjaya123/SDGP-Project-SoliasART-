// frontend/src/components/CheckoutButton.jsx
import axios from 'axios';

export default function CheckoutButton({ artworkId, buyerId, address, phone }) {
  
  const handlePayment = async () => {
    try {
      //Getting the secure hash and order details from your FastAPI backend
      const response = await axios.post("http://127.0.0.1:8000/api/checkout/initialize", {
        artwork_id: artworkId,
        buyer_id: buyerId,
        shipping_address: address,
        contact_number: phone
      });

      const config = response.data.payhere_config;

    
      const paymentObject = {
        sandbox: true, // MUST be true for testing
        merchant_id: config.merchant_id,
        return_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-cancel",
        notify_url: "https://your-ngrok-url.com/api/payment/webhook", // Critical: Must be a public URL (see Step 3)
        order_id: config.order_id,
        items: config.items,
        amount: config.amount,
        currency: config.currency,
        hash: config.hash, 
        // Customer details (You can pass actual buyer details here)
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: phone,
        address: address,
        city: "Colombo",
        country: "Sri Lanka"
      };

      // 3. Define what happens when the modal closes
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        // Redirect the user to a success page or show a checkmark
        window.location.href = `/order-success?order=${orderId}`;
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        console.log("Error:" + error);
        alert("Payment failed. Please try again.");
      };

      // 4. Trigger the popup!
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