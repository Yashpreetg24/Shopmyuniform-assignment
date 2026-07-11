import { useState, useEffect } from 'react';
import client from '../../api/client';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Forms state
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stockQuantity: '', size: '', categoryId: '' });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        client.get('/products?limit=100'),
        client.get('/categories')
      ]);
      setProducts(prodRes.data.items);
      setCategories(catRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Categories Handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await client.post('/admin/categories', { name: categoryName, slug: categorySlug });
      setCategoryName(''); setCategorySlug('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await client.delete(`/admin/categories/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  // Products Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity)
      };

      if (editingProductId) {
        await client.put(`/admin/products/${editingProductId}`, payload);
      } else {
        await client.post('/admin/products', payload);
      }
      
      setProductForm({ name: '', description: '', price: '', stockQuantity: '', size: '', categoryId: '' });
      setEditingProductId(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stockQuantity: p.stockQuantity,
      size: p.size || '',
      categoryId: p.categoryId
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      await client.delete(`/admin/products/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-6 border-b">
        <button 
          className={`pb-2 px-1 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`pb-2 px-1 font-medium ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form onSubmit={handleCreateCategory} className="flex gap-4 items-end">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input required type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Slug</label>
                <input required type="text" value={categorySlug} onChange={e => setCategorySlug(e.target.value)} className="border rounded px-3 py-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Category List</h2>
            <ul className="divide-y border rounded">
              {categories.map(cat => (
                <li key={cat.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({cat.slug})</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="text-xl font-bold mb-4">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-4">
              <input required placeholder="Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="border px-3 py-2" />
              <input placeholder="Description" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="border px-3 py-2" />
              <input required type="number" placeholder="Price (paise)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="border px-3 py-2" />
              <input required type="number" placeholder="Stock Qty" value={productForm.stockQuantity} onChange={e => setProductForm({...productForm, stockQuantity: e.target.value})} className="border px-3 py-2" />
              <input placeholder="Size" value={productForm.size} onChange={e => setProductForm({...productForm, size: e.target.value})} className="border px-3 py-2" />
              <select required value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} className="border px-3 py-2">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="col-span-2 flex gap-4 mt-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
                {editingProductId && (
                  <button type="button" onClick={() => {setEditingProductId(null); setProductForm({ name: '', description: '', price: '', stockQuantity: '', size: '', categoryId: '' });}} className="bg-gray-300 px-4 py-2 rounded flex-1">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Product List</h2>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-sm">{p.name}</td>
                      <td className="px-4 py-3 text-sm">₹{(p.price / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{p.stockQuantity}</td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <button onClick={() => handleEditProduct(p)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
