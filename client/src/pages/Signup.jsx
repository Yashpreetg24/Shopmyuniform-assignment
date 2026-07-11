import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      return setError('All fields are required');
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError('Please enter a valid email address');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
