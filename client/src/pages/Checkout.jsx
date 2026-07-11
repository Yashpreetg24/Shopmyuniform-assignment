import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      if (err.response?.data?.details) {
        setError(`Out of stock: ${err.response.data.details.map(d => d.name).join(', ')}`);
      } else {
        toast.error(err.response?.data?.error || 'Failed to place order');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h2>
        <button onClick={() => navigate('/products')} className="text-brand-600 font-medium hover:underline">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight text-center">Secure Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3">
          <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>
        
        <div className="space-y-6 mb-10">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center relative">
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {item.quantity}
                  </span>
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <Link to={`/products/${item.productId}`} className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                  {item.product.name}
                </Link>
              </div>
              <span className="font-semibold text-gray-900">₹{((item.product.price * item.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-10">
          <div className="flex justify-between items-center mb-3 text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">₹{(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600 font-medium text-sm bg-green-100 px-2 py-0.5 rounded">Free</span>
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <span className="font-bold text-gray-900 text-lg">Total due</span>
            <span className="font-black text-3xl text-brand-600">₹{(subtotal / 100).toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={placeOrder}
          disabled={placingOrder}
          className="w-full relative overflow-hidden bg-gray-900 text-white py-5 rounded-xl font-bold text-xl hover:bg-black hover:shadow-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed group"
        >
          {placingOrder ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Place Order securely
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
