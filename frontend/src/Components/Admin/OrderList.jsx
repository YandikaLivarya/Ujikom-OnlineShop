import React, { useState, useEffect } from 'react';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch semua orders dari backend
  useEffect(() => {
    fetchOrders();
    // Auto refresh setiap 5 detik
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payment/all-orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError('Gagal memuat orders');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk Update Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payment/update-order-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      const result = await response.json();
      if (result.success) {
        alert(`✅ Status order diperbarui ke: ${newStatus}`);
        fetchOrders(); // Refresh orders
      }
    } catch (err) {
      console.error('❌ Error updating status:', err);
      alert('❌ Gagal memperbarui status order');
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
          Customer <span className="text-lime-400">Orders</span>
        </h2>
        <div className="text-[10px] font-black bg-white/5 border border-white/10 px-4 py-2 rounded-lg uppercase tracking-widest text-gray-500">
          Total: {orders.length} Orders
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-gray-500 text-sm">Loading orders...</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl text-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-8 py-5">Date / ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Total Paid</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-white">{order.date}</p>
                    <p className="text-[10px] text-lime-400 font-mono mt-1">#{order.resi}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold uppercase">{order.customer?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{order.customer?.city || "Unknown City"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-gray-300">
                      {order.items?.length || 0} Item(s)
                    </p>
                  </td>
                  <td className="px-8 py-6 font-mono text-white text-sm">
                    IDR {order.totalPaid?.toLocaleString() || "0"}
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-[#1a1a1a] border border-white/10 text-lime-400 text-[9px] font-black uppercase px-3 py-1 rounded-full outline-none focus:border-lime-400 cursor-pointer"
                    >
                      <option value="On Process">On Process</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black uppercase text-gray-500 hover:text-white border-b border-gray-700 hover:border-white transition-all">
                      Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-600 italic uppercase text-xs font-bold tracking-widest">
                    No orders found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderList;