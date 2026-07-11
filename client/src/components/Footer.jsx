import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-bold text-2xl tracking-tight text-gray-900">
              ShopMy<span className="text-brand-600">Uniform</span>
            </Link>
            <p className="mt-4 text-gray-500 max-w-sm">
              Premium uniforms crafted for comfort and durability. Experience the difference of quality workwear.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase text-sm">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-500 hover:text-brand-600 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=new" className="text-gray-500 hover:text-brand-600 transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?category=sale" className="text-gray-500 hover:text-brand-600 transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase text-sm">Support</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-brand-600 transition-colors">FAQ</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-brand-600 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-brand-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopMyUniform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
