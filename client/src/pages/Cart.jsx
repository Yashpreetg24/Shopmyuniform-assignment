import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await client.get('/cart');
      setCartItems(res.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await client.put(`/cart/${itemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await client.delete(`/cart/${itemId}`);
      setCartItems(cartItems.filter(i => i.id !== itemId));
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <div className="text-center py-10">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-xs text-gray-400">Img</span>
              </div>
              <div>
                <Link to={`/products/${item.productId}`} className="font-semibold text-lg hover:text-blue-600">
                  {item.product.name}
                </Link>
                <p className="text-gray-500">₹{(item.product.price / 100).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center border rounded">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                >-</button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                >+</button>
              </div>
              
              <div className="font-semibold w-24 text-right">
                ₹{((item.product.price * item.quantity) / 100).toFixed(2)}
              </div>
              
              <button 
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Subtotal:</span>
            <span>₹{(subtotal / 100).toFixed(2)}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
