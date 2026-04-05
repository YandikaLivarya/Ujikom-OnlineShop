import React from 'react'

function FooterComponents() {
  return (
   <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
      
      {/* Kolom 1: Brand */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-black italic uppercase text-white mb-6">SKENASOCKS<span className="text-lime-400">.</span></h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Menciptakan standar baru dalam dunia kaos kaki. Estetika jalanan bertemu kenyamanan maksimal.
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-lime-400 hover:text-black transition">IG</a>
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-lime-400 hover:text-black transition">TW</a>
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-lime-400 hover:text-black transition">YT</a>
        </div>
      </div>

      {/* Kolom 2: Links */}
      <div>
        <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Shop</h4>
        <ul className="space-y-4 text-gray-500 text-sm">
          <li><a href="/collection" className="hover:text-lime-400">All Products</a></li>
          <li><a href="/#katalog" className="hover:text-lime-400">Limited Drop</a></li>
          <li><a href="#" className="hover:text-lime-400">Accessories</a></li>
        </ul>
      </div>

      {/* Kolom 3: Newsletter */}
      <div>
        <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Join the Club</h4>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Email Address" 
            className="w-full bg-white/5 border-b border-white/20 py-2 outline-none focus:border-lime-400 transition text-sm"
          />
          <button className="absolute right-0 top-2 text-lime-400 font-bold text-xs uppercase">Join</button>
        </div>
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
      <p className="text-[10px] text-gray-600 uppercase tracking-widest">© 2026 SkenaSocks Studio. All Rights Reserved.</p>
      <div className="flex gap-6">
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Privacy Policy</span>
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Terms of Service</span>
      </div>
    </div>
  </div>
</footer>
  )
}

export default FooterComponents
