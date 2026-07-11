import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/orders')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">You have no orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="font-medium text-lg">
                ₹{(order.totalAmount / 100).toFixed(2)}
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
              
              <Link 
                to={`/orders/${order.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
