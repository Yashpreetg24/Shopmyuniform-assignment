import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const removeItem = async (productId) => {
    try {
      await client.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.productId !== productId));
    } catch (error) {
      alert('Failed to remove from wishlist');
    }
  };

  const moveToCart = async (productId) => {
    try {
      await client.post('/cart', { productId, quantity: 1 });
      await removeItem(productId);
      alert('Moved to cart!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to move to cart');
    }
  };

  if (loading) return <div className="text-center py-10">Loading wishlist...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="h-32 bg-gray-100 flex items-center justify-center rounded mb-4">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
                <Link to={`/products/${item.productId}`} className="font-semibold hover:text-blue-600 block mb-1">
                  {item.product.name}
                </Link>
                <p className="text-gray-600 mb-4">₹{(item.product.price / 100).toFixed(2)}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => moveToCart(item.productId)}
                  disabled={item.product.stockQuantity <= 0}
                  className="bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {item.product.stockQuantity <= 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium border py-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
