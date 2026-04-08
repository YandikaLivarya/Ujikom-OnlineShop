import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const masterUser = import.meta.env.VITE_ADMIN_USER
    const masterPass = import.meta.env.VITE_ADMIN_PASS
    
    // KREDENSI RAHASIA (Ganti sesukamu)
    if (username === masterUser && password === masterPass) {
      localStorage.setItem("adminStatus", "authorized");
      navigate('/dashboard-admin');
    } else {
      alert("AKSES DITOLAK: Kamu bukan Admin S*CKSOCKS!");
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-6 sm:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        {/* Dekorasi Akses */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-lime-400/10 blur-2xl"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
            Admin <span className="text-lime-400">Portal</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-2">Restricted Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Identity</label>
            <input 
              required
              type="text" 
              placeholder="Username"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-lime-400 transition text-white"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Access Key</label>
            <input 
              required
              type="password" 
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-lime-400 transition text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-lime-400 text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_10px_30px_rgba(163,251,46,0.2)]">
            Enter Dashboard
          </button>
        </form>
      </div>
    </section>
  );
}