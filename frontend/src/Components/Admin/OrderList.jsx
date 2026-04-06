import React, { useState, useEffect } from 'react';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);


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

  // Fungsi untuk buka Details modal
  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Fungsi untuk tutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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
                    <p className="text-[10px] text-gray-500 mt-1">{order.customer?.city || order.customer?.address || "No Location"}</p>
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
                    <button 
                      onClick={() => handleDetailsClick(order)}
                      className="text-[10px] font-black uppercase text-gray-500 hover:text-white border-b border-gray-700 hover:border-white transition-all cursor-pointer"
                    >
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

      {/* Modal Details */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-lime-400 to-lime-500 px-8 py-6 flex justify-between items-center">
              <h3 className="text-lg font-black text-black uppercase tracking-widest">
                Order Details
              </h3>
              <button
                onClick={closeModal}
                className="text-black hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8 text-white space-y-6">
              {/* Order ID & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Order ID</p>
                  <p className="text-sm font-mono text-lime-400 mt-2">#{selectedOrder.resi}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Date</p>
                  <p className="text-sm text-white mt-2">{selectedOrder.date}</p>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-2">Current Status</p>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-lime-400 text-black text-xs font-black rounded-full">
                    {selectedOrder.status}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Payment: <span className="text-lime-400 font-bold">{selectedOrder.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-4">Customer Information</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span> <span className="text-white font-bold ml-2">{selectedOrder.customer?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span> <span className="text-white font-mono ml-2">{selectedOrder.customer?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> <span className="text-white ml-2">{selectedOrder.customer?.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">City:</span> <span className="text-white ml-2">{selectedOrder.customer?.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span> <span className="text-white ml-2">{selectedOrder.customer?.address || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-4">
                  Order Items ({selectedOrder.items?.length || 0})
                </p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-white">{item.name}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-lime-400">IDR {item.price?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Total: IDR {(item.price * item.qty)?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Payment */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center text-lg font-black mb-2">
                  <span>Total Paid:</span>
                  <span className="text-lime-400">IDR {selectedOrder.totalPaid?.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-2">
                  <p>Payment Method: {selectedOrder.paymentMethod || '-'}</p>
                  <p>Invoice ID: {selectedOrder.invoiceId || '-'}</p>
                </div>
              </div>

              {/* Close Button */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-lime-400 text-black font-black rounded-lg hover:bg-lime-500 transition-all uppercase text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;