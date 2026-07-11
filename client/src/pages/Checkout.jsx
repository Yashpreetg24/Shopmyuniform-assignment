import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/cart')
      .then(res => setCartItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const placeOrder = async () => {
    try {
      setPlacingOrder(true);
      setError(null);
      const res = await client.post('/orders');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      if (err.response?.data?.details) {
        setError(`Out of stock: ${err.response.data.details.map(d => d.name).join(', ')}`);
      } else {
        setError(err.response?.data?.error || 'Failed to place order');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <div className="text-center py-10">Loading checkout...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6 font-medium">{error}</div>}

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold border-b pb-2">Order Summary</h2>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center py-2">
            <div>
              <span className="font-medium">{item.product.name}</span>
              <span className="text-gray-500 ml-2">x {item.quantity}</span>
            </div>
            <span>₹{((item.product.price * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-4 border-t text-xl font-bold">
          <span>Total:</span>
          <span>₹{(subtotal / 100).toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={placeOrder}
        disabled={placingOrder}
        className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {placingOrder ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
