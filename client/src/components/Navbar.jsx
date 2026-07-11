import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      client.get('/cart')
        .then(res => {
          const count = res.data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [user, location.pathname]); // Refresh cart count on route change as a simple workaround

  const isActive = (path) => location.pathname === path;
  
  const linkBaseClass = "inline-flex items-center px-1 pt-1 font-medium text-sm transition-colors";
  const getLinkClass = (path) => 
    `${linkBaseClass} ${isActive(path) ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-900'}`;

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center font-bold text-2xl tracking-tight text-gray-900">
              ShopMy<span className="text-brand-600">Uniform</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/products" className={getLinkClass('/products')}>
                Catalog
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-600 hover:text-brand-600 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6 text-sm font-medium">
                <Link to="/wishlist" className="text-gray-600 hover:text-brand-600 transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <Link to="/orders" className="text-gray-600 hover:text-gray-900 transition-colors">Orders</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-brand-600 hover:text-brand-800 transition-colors">Admin</Link>
                )}
                <button 
                  onClick={logout} 
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
