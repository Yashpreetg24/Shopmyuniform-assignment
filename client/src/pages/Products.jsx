import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../api/client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [size, setSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    client.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(categoryId && { categoryId }),
        ...(minPrice && { minPrice: minPrice * 100 }),
        ...(maxPrice && { maxPrice: maxPrice * 100 }),
        ...(size && { size }),
        ...(sortBy && { sortBy }),
        ...(debouncedSearch && { search: debouncedSearch })
      });
      const res = await client.get(`/products?${params}`);
      setProducts(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId, debouncedSearch, minPrice, maxPrice, size, sortBy]);

  // Helper for placeholder images based on category ID
  const getPlaceholderImage = (id, idx) => {
    const seed = (id.charCodeAt(0) + idx) % 10;
    return `https://images.unsplash.com/photo-${[
      '1515347619362-f6745e12e75e', '1521572163474-6864f9cf17ab', '1532453288672-3a27e9be9efd',
      '1584982751601-97dcc096659c', '1550639525-c97d455bfcce', '1487222477894-8943e31ef7b2',
      '1580651315530-69c8e0026377', '1577219491135-ce391730fb2c', '1523381210434-271e8be1f52b',
      '1515347619362-f6745e12e75e'
    ][seed]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`;
  };

  return (
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row gap-10"
    >
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 shrink-0 space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Search</h2>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Category</h2>
          <select value={categoryId} onChange={handleFilterChange(setCategoryId)} className="w-full border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm py-2 px-3">
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Price Range (₹)</h2>
          <div className="flex gap-4 items-center">
            <input type="number" placeholder="Min" value={minPrice} onChange={handleFilterChange(setMinPrice)} className="w-full border-gray-300 rounded-lg focus:ring-brand-500 bg-white shadow-sm py-2 px-3" />
            <span className="text-gray-400">-</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={handleFilterChange(setMaxPrice)} className="w-full border-gray-300 rounded-lg focus:ring-brand-500 bg-white shadow-sm py-2 px-3" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Sort By</h2>
          <select value={sortBy} onChange={handleFilterChange(setSortBy)} className="w-full border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm py-2 px-3">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Collection</h1>
          <p className="text-gray-500 text-sm hidden sm:block">Showing {products.length} products</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
                <div className="relative aspect-[4/5] bg-gray-200"></div>
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-auto pt-2 flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={() => {setSearch(''); setCategoryId(''); setMinPrice(''); setMaxPrice(''); setSize('');}} className="mt-6 text-brand-600 hover:text-brand-800 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {products.map((product, idx) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <Link 
                      to={`/products/${product.id}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                    >
                      <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                        <img 
                          src={getPlaceholderImage(product.id, idx)} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {product.stockQuantity <= 0 && (
                          <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                            Sold Out
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <span className="block w-full bg-white/90 backdrop-blur text-gray-900 text-center font-bold py-3 rounded-xl shadow-lg">
                            View Product
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-sm text-gray-500 mb-1">{product.category?.name || 'Category'}</p>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{product.name}</h3>
                        <div className="mt-auto flex justify-between items-center">
                          <p className="text-brand-600 font-bold text-lg">₹{(product.price / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center space-x-4">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${page === i + 1 ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
