import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Inventory from '../Components/Admin/Inventory'; 
import OrderList from '../Components/Admin/OrderList'; 

function DashboardAdmin() {
  const [activeMenu, setActiveMenu] = useState('inventory');
  const navigate = useNavigate();

  // --- 1. SISTEM PENGAMAN (SATUPAM) ---
  useEffect(() => {
    const status = localStorage.getItem("adminStatus");
    if (status !== "authorized") {
      // replace: true agar user tidak bisa klik 'Back' untuk kembali ke dashboard
      navigate('/admin-login', { replace: true }); 
    }
  }, [navigate]);

  // --- 2. KUNCI PINTU (Mencegah Bypass Visual) ---
  // Jika status tidak authorized, jangan render HTML sama sekali
  if (localStorage.getItem("adminStatus") !== "authorized") {
    return null; 
  }

  // --- 3. FUNGSI LOGOUT ---
  const handleLogout = () => {
    if (window.confirm("Keluar dari Dashboard Admin?")) {
      localStorage.removeItem("adminStatus");
      navigate('/admin-login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-[#0f0f0f] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-black italic mb-10 hidden md:block tracking-tighter">
            S*CK<span className="text-lime-400">ADMIN</span>
          </h1>
          
          <nav className="space-y-4">
            <button 
              onClick={() => setActiveMenu('inventory')}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${activeMenu === 'inventory' ? 'bg-lime-400 text-black shadow-[0_0_20px_rgba(163,251,46,0.2)]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <span className="text-lg">📦</span> 
              <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Inventory</span>
            </button>
            
            <button 
              onClick={() => setActiveMenu('orders')}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${activeMenu === 'orders' ? 'bg-lime-400 text-black shadow-[0_0_20px_rgba(163,251,46,0.2)]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <span className="text-lg">🛒</span> 
              <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Orders</span>
            </button>
          </nav>
        </div>

        {/* TOMBOL LOGOUT */}
        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full p-4 rounded-xl flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <span className="text-lg group-hover:scale-110 transition">🚪</span>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-grow p-8 overflow-y-auto custom-scrollbar">
        {/* Header Dinamis */}
        <div className="mb-8">
          <p className="text-[10px] text-lime-400 font-mono tracking-[0.4em] uppercase mb-1">// System/Control</p>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            {activeMenu === 'inventory' ? 'Product Inventory' : 'Incoming Orders'}
          </h2>
        </div>

        {/* Konten Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeMenu === 'inventory' ? (
            <Inventory />
          ) : (
            <OrderList /> 
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardAdmin;