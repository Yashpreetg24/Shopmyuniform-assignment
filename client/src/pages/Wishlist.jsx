import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await client.get('/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await client.delete(`/wishlist/${itemId}`);
      setWishlist(wishlist.filter(i => i.id !== itemId));
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  // Helper for placeholder images
  const getPlaceholderImage = (id) => {
    const seed = (id.charCodeAt(0)) % 10;
    return `https://images.unsplash.com/photo-${[
      '1515347619362-f6745e12e75e', '1521572163474-6864f9cf17ab', '1532453288672-3a27e9be9efd',
      '1584982751601-97dcc096659c', '1550639525-c97d455bfcce', '1487222477894-8943e31ef7b2',
      '1580651315530-69c8e0026377', '1577219491135-ce391730fb2c', '1523381210434-271e8be1f52b',
      '1515347619362-f6745e12e75e'
    ][seed]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Wishlist</h1>
          <p className="mt-2 text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <svg className="mx-auto h-20 w-20 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Found something you like? Tap the heart icon to save it here for later.</p>
          <Link to="/products" className="inline-block bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 transition-colors">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map(item => (
            <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col relative">
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Remove"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <Link to={`/products/${item.productId}`} className="relative aspect-[4/5] bg-gray-100 overflow-hidden block shrink-0">
                <img 
                  src={getPlaceholderImage(item.productId)} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">{item.product.category?.name || 'Category'}</p>
                <Link to={`/products/${item.productId}`}>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">{item.product.name}</h3>
                </Link>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="font-bold text-lg text-gray-900">₹{(item.product.price / 100).toFixed(2)}</span>
                  <Link 
                    to={`/products/${item.productId}`}
                    className="text-brand-600 font-semibold text-sm hover:underline"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
