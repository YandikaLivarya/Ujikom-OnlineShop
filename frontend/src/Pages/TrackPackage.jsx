import React, { useState, useEffect } from 'react'

function TrackPackage() {
  const [resi, setResi] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lastResi = localStorage.getItem("lastTrackingNumber");
    if (lastResi) {
      setResi(lastResi);
    }
  }, []);

  // Fetch order dari backend berdasarkan resi
  const fetchOrderByResi = async (trackingResi) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payment/order/${trackingResi}`);
      if (!response.ok) throw new Error('Order not found');
      
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      return null;
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setError(false);
    setShowResult(false);
    setIsSearching(true);

    try {
      // Fetch order dari backend
      const foundOrder = await fetchOrderByResi(resi);

      setTimeout(() => {
        setIsSearching(false);
        
        if (foundOrder) {
          setOrderData(foundOrder);
          setShowResult(true);
        } else {
          setError(true);
        }
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
      setIsSearching(false);
      setError(true);
    }
  };

  // Auto refresh order data setiap 5 detik jika sedang ditampilkan
  useEffect(() => {
    if (showResult && orderData) {
      const interval = setInterval(async () => {
        const updatedOrder = await fetchOrderByResi(orderData.resi);
        if (updatedOrder) {
          setOrderData(updatedOrder);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showResult, orderData]);

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lime-400 font-mono text-xs tracking-[0.4em] mb-3 uppercase">// Logistics Portal</p>
          <h1 className="text-5xl font-black uppercase italic leading-none">Track <span className="text-outline">Package</span></h1>
        </div>

        {/* Form Input */}
        <div className="mb-12">
          <form onSubmit={handleTrack} className="flex gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-lime-400/50 transition-all">
            <input 
              required
              type="text" 
              value={resi}
              placeholder="ENTER TRACKING NUMBER (e.g. SKN-882910)"
              className="flex-grow bg-transparent px-6 py-4 outline-none text-sm font-bold uppercase tracking-widest placeholder:text-gray-600"
              onChange={(e) => setResi(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-lime-400 text-black px-8 py-4 rounded-xl font-black uppercase text-xs hover:bg-white disabled:bg-gray-600 transition-all duration-300"
            >
              {isSearching ? "Searching..." : "Track"}
            </button>
          </form>
          {error && <p className="text-red-500 text-[10px] mt-4 ml-2 font-bold uppercase tracking-widest animate-bounce">! Package ID Not Found. Please check your receipt.</p>}
        </div>

        {showResult && orderData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Info Utama */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl rounded-full"></div>
               
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Current Status</p>
                {/* SINKRON REAL-TIME: Mengikuti status dari Admin Dashboard */}
                <p className="text-xl font-black uppercase text-lime-400 italic">{orderData.status}</p>
                <p className="text-[9px] text-gray-600 mt-1">Last update: {new Date(orderData.updatedAt).toLocaleString('id-ID')}</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Estimation</p>
                <p className="text-xl font-black uppercase">
                  {orderData.status === "Delivered" ? "Arrived" : "2-3 Business Days"}
                </p>
              </div>
              <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Receipt ID</p>
                <p className="text-xl font-black uppercase font-mono">{orderData.resi}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Order Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Customer Name</p>
                  <p className="text-sm font-bold">{orderData.customer?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Email</p>
                  <p className="text-sm font-bold">{orderData.customer?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Phone</p>
                  <p className="text-sm font-bold">{orderData.customer?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">City</p>
                  <p className="text-sm font-bold">{orderData.customer?.city || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Shipping Address</p>
                  <p className="text-sm font-bold">{orderData.customer?.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Items Ordered</p>
              <div className="space-y-3">
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-b-0">
                      <div>
                        <p className="text-sm font-bold">{item.name || 'Product'}</p>
                        <p className="text-[9px] text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold text-lime-400">IDR {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items found</p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Total Paid</p>
                <p className="text-lg font-black text-lime-400">IDR {orderData.totalPaid?.toLocaleString() || '0'}</p>
              </div>
            </div>

            {/* Stepper Dinamis */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute left-[51px] top-20 bottom-20 w-[2px] bg-white/5"></div>
              <div className="space-y-12">
                

                {/* Step 1: Order Processed (Selalu Hijau) */}
                <div className="flex items-start gap-6 relative">
                  <div className="z-10 w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center ring-8 ring-lime-400/10 shadow-[0_0_20px_rgba(163,251,46,0.3)]">
                    <span className="text-[10px] text-black font-black">✓</span>
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-white">Order Processed</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">System Verified • {orderData.date}</p>
                  </div>
                </div>

                {/* Step 2: Shipped (Hijau jika status Shipped/Delivery/Delivered) */}
                <div className={`flex items-start gap-6 relative transition-opacity duration-500 ${["Shipped", "Out for Delivery", "Delivered"].includes(orderData.status) ? "opacity-100" : "opacity-20"}`}>
                  <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ring-8 ${["Shipped", "Out for Delivery", "Delivered"].includes(orderData.status) ? "bg-lime-400 ring-lime-400/10" : "bg-white/20 ring-transparent"}`}>
                    <span className="text-[10px] text-black font-black">{["Shipped", "Out for Delivery", "Delivered"].includes(orderData.status) ? "✓" : ""}</span>
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic">Package Shipped</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">In Transit to Destination</p>
                  </div>
                </div>

                {/* Step 3: Arrived (Hijau jika status Delivered) */}
                <div className={`flex items-start gap-6 relative transition-opacity duration-500 ${orderData.status === "Delivered" ? "opacity-100" : "opacity-20"}`}>
                  <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ring-8 ${orderData.status === "Delivered" ? "bg-lime-400 ring-lime-400/30 animate-pulse" : "bg-white/20 ring-transparent"}`}>
                    <span className="text-[10px] text-black font-black">{orderData.status === "Delivered" ? "✓" : ""}</span>
                  </div>
                  <div>
                    <h4 className={`font-black uppercase italic ${orderData.status === "Delivered" ? "text-lime-400" : ""}`}>Delivered</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">Package Received</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <button className="text-[10px] font-black uppercase text-gray-500 hover:text-white border-b border-gray-500 pb-1 tracking-[0.3em] transition">
            Need Help? Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}

export default TrackPackage;