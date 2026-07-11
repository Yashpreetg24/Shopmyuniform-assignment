import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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
      setIsAddingToCart(true);
      await client.post('/cart', { productId: product.id, quantity: 1 });
      // Add a small delay for animation effect
      toast.success('Added to cart!');
      setTimeout(() => setIsAddingToCart(false), 500);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
      setIsAddingToCart(false);
    }
  };

  const addToWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      await client.post('/wishlist', { productId: product.id });
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to wishlist');
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12"
    >
      <div className="md:w-1/2">
        <div className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse"></div>
      </div>
      <div className="md:w-1/2 flex flex-col justify-center space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="space-y-3 mt-6">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
      <Link to="/products" className="text-brand-600 font-medium hover:underline">Return to collection</Link>
    </div>
  );

  const isOutOfStock = product.stockQuantity <= 0;
  // Parse sizes if it's a comma separated string, else just use the string or default array
  const sizes = product.size ? product.size.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL'];

  // Helper for placeholder images
  const getPlaceholderImage = (id) => {
    const seed = (id.charCodeAt(0)) % 10;
    return `https://images.unsplash.com/photo-${[
      '1515347619362-f6745e12e75e', '1521572163474-6864f9cf17ab', '1532453288672-3a27e9be9efd',
      '1584982751601-97dcc096659c', '1550639525-c97d455bfcce', '1487222477894-8943e31ef7b2',
      '1580651315530-69c8e0026377', '1577219491135-ce391730fb2c', '1523381210434-271e8be1f52b',
      '1515347619362-f6745e12e75e'
    ][seed]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/2 relative bg-gray-100">
          <div className="aspect-square w-full">
            <img 
              src={getPlaceholderImage(product.id)} 
              alt={product.name}
              className="w-full h-full object-cover" 
            />
          </div>
          {isOutOfStock && (
            <div className="absolute top-6 left-6 bg-gray-900/80 backdrop-blur text-white font-bold px-4 py-2 rounded-full shadow-lg">
              Out of Stock
            </div>
          )}
        </div>
        
        {/* Right: Product Details */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">{product.category?.name || 'Category'}</span>
            <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
              {isOutOfStock ? 'Currently Unavailable' : `${product.stockQuantity} in stock`}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
            {product.name}
          </h1>
          
          <p className="text-3xl font-bold text-gray-900 mb-8">
            ₹{(product.price / 100).toFixed(2)}
          </p>
          
          <div className="prose prose-sm text-gray-500 mb-10 max-w-none">
            <p className="text-base leading-relaxed">
              {product.description || 'Experience premium quality and comfort with this carefully crafted piece. Designed for the modern professional who demands both style and durability in their daily wear.'}
            </p>
          </div>
          
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Select Size</h3>
              <button className="text-sm text-brand-600 hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-semibold text-sm transition-all
                    ${selectedSize === s 
                      ? 'bg-gray-900 text-white shadow-lg scale-105 border-transparent' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t flex gap-4">
            <button 
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`flex-1 relative overflow-hidden py-4 rounded-xl font-bold text-lg transition-all duration-300
                ${isOutOfStock 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : isAddingToCart
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                }
              `}
            >
              {isOutOfStock ? 'Out of Stock' : (isAddingToCart ? 'Added!' : 'Add to Cart')}
            </button>
            
            <button 
              onClick={addToWishlist}
              className="w-16 h-16 flex items-center justify-center bg-gray-50 text-gray-600 border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              title="Add to Wishlist"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
