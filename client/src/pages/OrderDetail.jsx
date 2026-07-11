import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading order details...</div>;
  if (!order) return <div className="text-center py-10 text-red-500">Order not found.</div>;

  const statuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-500 mt-1">Order #{order.id}</p>
          <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-gray-800">₹{(order.totalAmount / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-10 mt-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        <div className="flex justify-between">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            return (
              <div key={status} className="flex flex-col items-center bg-white px-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {isCompleted && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-xs font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded flex justify-center items-center">
                  <span className="text-[10px] text-gray-400">Img</span>
                </div>
                <div>
                  <Link to={`/products/${item.productId}`} className="font-semibold text-blue-600 hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="font-semibold">
                ₹{((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
