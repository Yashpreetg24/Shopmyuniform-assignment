import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      setPage(1); // reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle other filter changes (reset page)
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(categoryId && { categoryId }),
        ...(minPrice && { minPrice: minPrice * 100 }), // backend expects paise/cents
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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow h-fit space-y-4">
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={categoryId} onChange={handleFilterChange(setCategoryId)} className="w-full border rounded px-3 py-2">
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price Range (₹)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={minPrice} onChange={handleFilterChange(setMinPrice)} className="w-1/2 border rounded px-3 py-2" />
            <input type="number" placeholder="Max" value={maxPrice} onChange={handleFilterChange(setMaxPrice)} className="w-1/2 border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <input type="text" placeholder="e.g. M, L, 32" value={size} onChange={handleFilterChange(setSize)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select value={sortBy} onChange={handleFilterChange(setSortBy)} className="w-full border rounded px-3 py-2">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full md:w-3/4">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-gray-500">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden border">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-500 mb-2">₹{(product.price / 100).toFixed(2)}</p>
                      <Link 
                        to={`/products/${product.id}`}
                        className="mt-2 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 flex items-center">Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
