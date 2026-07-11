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

  // Helper for placeholder images
  const getPlaceholderImage = (id) => {
    const seed = (id.charCodeAt(0)) % 10;
    return `https://images.unsplash.com/photo-${[
      '1515347619362-f6745e12e75e', '1521572163474-6864f9cf17ab', '1532453288672-3a27e9be9efd',
      '1584982751601-97dcc096659c', '1550639525-c97d455bfcce', '1487222477894-8943e31ef7b2',
      '1580651315530-69c8e0026377', '1577219491135-ce391730fb2c', '1523381210434-271e8be1f52b',
      '1515347619362-f6745e12e75e'
    ][seed]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
        <svg className="mx-auto h-20 w-20 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium collection today.</p>
        <Link to="/products" className="inline-block bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 space-y-6">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Link to={`/products/${item.productId}`} className="shrink-0">
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
                  <img src={getPlaceholderImage(item.productId)} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
              </Link>
              
              <div className="flex-grow w-full">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/products/${item.productId}`} className="font-bold text-lg text-gray-900 hover:text-brand-600 transition-colors line-clamp-2">
                    {item.product.name}
                  </Link>
                  <p className="font-bold text-lg text-gray-900 ml-4 shrink-0">₹{((item.product.price * item.quantity) / 100).toFixed(2)}</p>
                </div>
                
                <p className="text-gray-500 text-sm mb-6">{item.product.category?.name || 'Category'}</p>
                
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-4 py-2 hover:bg-gray-200 text-gray-600 transition-colors font-medium"
                    >-</button>
                    <span className="px-4 py-2 font-semibold text-gray-900 bg-white border-x border-gray-200">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-200 text-gray-600 transition-colors font-medium"
                    >+</button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-8">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-black text-2xl text-gray-900">₹{(subtotal / 100).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
