import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      const res = await client.get(`/products?page=${pageNum}`);
      setProducts(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          
          <div className="mt-8 flex justify-center space-x-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
