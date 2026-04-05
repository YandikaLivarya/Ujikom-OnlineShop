import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function OrderSuccess() {
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    // Ambil data pesanan terakhir yang disimpan di Payment.jsx
    const lastOrder = JSON.parse(localStorage.getItem("activeOrder"));
    if (lastOrder) {
      setOrderInfo(lastOrder);
    }
  }, []);

  // Jika data tidak ada (user akses langsung via URL), tampilkan ID default
  const displayId = orderInfo ? orderInfo.resi : "SKN-XXXXXX";
  const displayTotal = orderInfo ? orderInfo.totalPaid.toLocaleString() : "0";

  return (
    <section className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6 py-20 relative overflow-hidden font-sans">
  
      {/* Efek Cahaya di Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-400/5 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full z-10 text-center">
        
        {/* Ikon Success Animatif */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(217,249,157,0.3)] animate-pulse">
            <span className="text-black text-4xl font-black">✓</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rotate-45 border-4 border-black"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 rounded-full"></div>
        </div>

        {/* Teks Utama */}
        <h1 className="text-4xl font-black uppercase italic text-white mb-2 leading-none tracking-tighter">
          Order <span className="text-lime-400">Confirmed</span>
        </h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-10">Transaction ID: #{displayId}</p>

        {/* Digital Receipt Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent"></div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Status</p>
              <p className="text-xs text-lime-400 font-black uppercase tracking-tighter italic">Paid / Ready to Ship</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Method</p>
              <p className="text-xs text-white font-mono uppercase tracking-tighter">{orderInfo?.method || "Digital Payment"}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Paid</p>
              <p className="text-sm text-white font-black">IDR {displayTotal}</p>
            </div>
            
            <hr className="border-dashed border-white/10 my-4" />
            
            <div className="text-center py-2">
               <p className="text-[10px] text-gray-500 uppercase font-black mb-1 italic">Welcome to the inner circle</p>
               <p className="text-lg text-white font-black uppercase italic tracking-tighter">S*CKSOCKS Club</p>
            </div>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="mt-12 space-y-4">
          <Link 
            to="/track-package" 
            className="block w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-lime-400 transition-all duration-300 text-center shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
          >
            Track Your Package
          </Link>
          <Link 
            to="/" 
            className="block text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition duration-300"
          >
            Return to Home Store
          </Link>
        </div>

      </div>
    </section>
  )
}