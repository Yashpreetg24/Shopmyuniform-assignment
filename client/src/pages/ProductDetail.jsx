import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    client.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await client.post('/cart', { productId: product.id, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const addToWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      await client.post('/wishlist', { productId: product.id });
      alert('Added to wishlist!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add to wishlist');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Product not found.</div>;

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2 h-64 md:h-96 bg-gray-200 flex items-center justify-center rounded">
        <span className="text-gray-400">No Image</span>
      </div>
      
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-blue-600 font-semibold">₹{(product.price / 100).toFixed(2)}</p>
        
        <p className="text-gray-600">{product.description}</p>
        
        {product.size && (
          <div>
            <span className="font-semibold text-gray-700">Size:</span> {product.size}
          </div>
        )}
        
        <div>
          <span className="font-semibold text-gray-700">Category:</span> {product.category?.name}
        </div>
        
        <div>
          <span className="font-semibold text-gray-700">Availability:</span>{' '}
          {isOutOfStock ? (
            <span className="text-red-500 font-medium">Out of Stock</span>
          ) : (
            <span className="text-green-600 font-medium">{product.stockQuantity} in stock</span>
          )}
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            onClick={addToCart}
            disabled={isOutOfStock}
            className="flex-1 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <button 
            onClick={addToWishlist}
            className="flex-1 bg-gray-100 text-gray-800 border py-3 rounded font-medium hover:bg-gray-200"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
