import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600">
              ShopMyUniform
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/products" className="text-gray-900 inline-flex items-center px-1 pt-1 font-medium">Products</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/cart" className="text-gray-900 font-medium">Cart (0)</Link>
            {user ? (
              <>
                <Link to="/orders" className="text-gray-900 font-medium">Orders</Link>
                <Link to="/wishlist" className="text-gray-900 font-medium">Wishlist</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-red-600 font-medium">Admin</Link>
                )}
                <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-blue-600 font-medium">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
