import { useState } from "react"
import { Link } from "react-router-dom" // Wajib diimport
import Katalog from "./Katalog"

function Home() {
  return (
    <div>
      {/* SECTION HERO */}
      <section className="relative min-h-screen bg-[#0f0f0f] flex items-center justify-center overflow-hidden pt-20">
        
        {/* 1. Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[20vw] font-black text-white/[0.03] uppercase leading-none select-none tracking-tighter">
            S*CKS
          </h1>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
          
          {/* 2. Tulisan Utama (Kiri) */}
          <div className="max-w-2xl text-center md:text-left">
            <span className="inline-block bg-lime-400 text-black px-3 py-1 text-[10px] font-black uppercase mb-4 rotate-[-2deg]">
              New Drop: Urban Series
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] uppercase italic tracking-tighter">
              Step Into <br /> 
              <span className="text-lime-400">The Future</span>
            </h2>
            <p className="mt-6 text-gray-400 max-w-md text-sm md:text-base tracking-wide uppercase font-medium opacity-80">
              Dibuat untuk mereka yang bergerak di jalanan. Material premium, desain radikal. Pastikan langkahmu berbeda dari yang lain.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/collection" className="bg-white text-black font-black px-10 py-4 rounded-full uppercase text-xs hover:bg-lime-400 transition-all duration-300 text-center">
                Belanja Sekarang
              </Link>
              <a href="#featured-katalog" className="border border-white/20 text-white font-bold px-10 py-4 rounded-full uppercase text-xs hover:bg-white/10 transition text-center">
                Lihat Katalog
              </a>
            </div>
          </div>

          {/* 3. Gambar Produk (Kanan) */}
          <div className="relative mt-20 md:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime-400/20 blur-[100px] rounded-full"></div>
            
            <img 
              src="/animasi.png"
              alt="Skena Socks" 
              className="w-72 md:w-[450px] relative z-10 animate-bounce-slow drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
            />
            
            <div className="absolute -right-4 top-10 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl rotate-12">
              <p className="text-white font-bold text-[10px] uppercase tracking-widest">Cotton Bamboo 100%</p>
              <p className="text-lime-400 font-black italic">Rp 89.000</p>
            </div>
          </div>
        </div>

        {/* Ornamen Footer Hero */}
        <div className="absolute bottom-10 left-0 right-0 hidden md:flex justify-center space-x-12 opacity-30">
          <span className="text-white text-[10px] tracking-[0.5em] uppercase italic font-bold">Anti-Slip Tech</span>
          <span className="text-white text-[10px] tracking-[0.5em] uppercase italic font-bold">Street-Ready</span>
          <span className="text-white text-[10px] tracking-[0.5em] uppercase italic font-bold">Limited Edition</span>
        </div>
      </section>

      {/* SECTION KATALOG (Dinamis dari Database) */}
      <div id="featured-katalog">
        <Katalog />
      </div>
    </div>
  )
}

export default Home