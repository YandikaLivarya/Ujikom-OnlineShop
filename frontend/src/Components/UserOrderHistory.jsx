import { useState, useEffect } from 'react';
import { useApiUrl } from '../hooks/useApiUrl';

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'x-ngrok-skip-browser-warning': 'true',
};

function UserOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const API_URL = useApiUrl();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData._id && !userData.id) {
        setError('User ID tidak ditemukan. Silakan login kembali.');
        setLoading(false);
        return;
      }

      const userId = userData._id || userData.id;

      const response = await fetch(`${API_URL}/api/payment/user-orders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...NGROK_HEADERS,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError('Gagal memuat order history');
    } finally {
      setLoading(false);
    }
  };

  const openBillModal = (order) => {
    setSelectedOrder(order);
    setShowBillModal(true);
  };

  const closeBillModal = () => {
    setShowBillModal(false);
    setSelectedOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'On Process': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Shipped': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Out for Delivery': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Delivered': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
          Order <span className="text-lime-400">History</span>
        </h2>
        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">
          Total Orders: {orders.length}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center">
          <p className="text-gray-500 text-sm">Loading order history...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-1">Order ID</p>
                  <p className="text-sm font-mono text-lime-400 font-bold">#{order.resi}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-1">Date</p>
                  <p className="text-sm text-white">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 border rounded-full text-xs font-black uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => openBillModal(order)}
                    className="px-6 py-2 bg-lime-400 text-black font-black uppercase text-[10px] rounded-full hover:bg-white transition-all"
                  >
                    View Bill
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Items</p>
                  <p className="text-sm font-bold text-white">{order.items?.length || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Total</p>
                  <p className="text-sm font-mono text-lime-400 font-bold">IDR {order.totalPaid?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Payment</p>
                  <p className={`text-sm font-bold ${order.paymentStatus === 'PAID' ? 'text-green-400' : order.paymentStatus === 'PENDING' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Method</p>
                  <p className="text-sm font-bold text-gray-300">{order.paymentMethod || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/10 rounded-2xl">
          <p className="text-gray-500 italic uppercase text-xs font-bold tracking-widest">
            No orders yet
          </p>
        </div>
      )}

      {/* Bill Modal */}
      {showBillModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 print:bg-white">
          <div className="bg-white text-black rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Bill Header */}
            <div className="bg-gradient-to-r from-lime-400 to-lime-500 px-8 py-6 print:bg-lime-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter mb-2">INVOICE</h1>
                  <p className="text-xs font-bold uppercase tracking-widest">SKN {selectedOrder.resi}</p>
                </div>
                <button
                  onClick={closeBillModal}
                  className="text-black hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all print:hidden"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Bill Content */}
            <div className="p-8">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b-2 border-gray-300">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-1">Order Date</p>
                  <p className="text-lg font-bold">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-1">Invoice ID</p>
                  <p className="text-lg font-mono font-bold">{selectedOrder.invoiceId || '-'}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-100 p-6 rounded-lg mb-8">
                <p className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-3">Bill To</p>
                <p className="text-lg font-bold mb-1">{selectedOrder.customer?.name}</p>
                <p className="text-sm text-gray-700 mb-1">{selectedOrder.customer?.email}</p>
                <p className="text-sm text-gray-700 mb-1">{selectedOrder.customer?.phone || '-'}</p>
                <p className="text-sm text-gray-700 mb-1">{selectedOrder.customer?.address || '-'}</p>
                <p className="text-sm text-gray-700">{selectedOrder.customer?.city || '-'}</p>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-4">Order Items</p>
                <table className="w-full text-sm">
                  <thead >
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-3 font-bold text-gray-800">Product</th>
                      <th className="text-center py-2 px-3 font-bold text-gray-800">Qty</th>
                      <th className="text-right py-2 px-3 font-bold text-gray-800">Price</th>
                      <th className="text-right py-2 px-3 font-bold text-gray-800">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-3 px-3 text-gray-800">{item.name}</td>
                        <td className="text-center py-3 px-3 text-gray-800">{item.qty}</td>
                        <td className="text-right py-3 px-3 text-gray-800">IDR {item.price?.toLocaleString()}</td>
                        <td className="text-right py-3 px-3 text-gray-800">IDR {(item.price * item.qty)?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-full md:w-80">
                  <div className="flex justify-between py-2 border-t-2 border-gray-300 mb-2">
                    <span className="font-bold text-gray-800">Subtotal:</span>
                    <span className="text-gray-800">IDR {selectedOrder.totalPaid?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b-2 border-gray-300 mb-3">
                    <span className="font-bold text-gray-800">Tax:</span>
                    <span className="text-gray-800">IDR 0</span>
                  </div>
                  <div className="flex justify-between py-3 bg-lime-100 px-4 rounded-lg">
                    <span className="font-black text-xl">TOTAL</span>
                    <span className="font-black text-xl text-lime-600">IDR {selectedOrder.totalPaid?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-8 text-sm text-gray-800">
                <p className="font-bold mb-2">Payment Information</p>
                <p>Payment Method: <span className="font-bold">{selectedOrder.paymentMethod || '-'}</span></p>
                <p>Status: <span className={`font-bold ${selectedOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedOrder.paymentStatus}</span></p>
              </div>

              {/* Footer */}
              <div className="text-center border-t-2 border-gray-300 pt-6 text-xs text-gray-600">
                <p className="font-bold mb-2">Thank You for Your Purchase!</p>
                <p>For inquiries, please contact us at support@example.com</p>
              </div>

              {/* Print Button */}
              <div className="flex gap-3 mt-8 print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-lime-400 text-black font-black rounded-lg hover:bg-lime-500 transition-all uppercase text-sm"
                >
                  🖨️ Print Bill
                </button>
                <button
                  onClick={closeBillModal}
                  className="flex-1 py-3 bg-gray-200 text-black font-black rounded-lg hover:bg-gray-300 transition-all uppercase text-sm"
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

export default UserOrderHistory;
