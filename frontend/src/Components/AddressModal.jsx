import React from 'react';

const AddressModal = ({ isOpen, onClose, onProceed, setShippingData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Container Modal */}
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-[32px] p-8 relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Shipping <span className="text-lime-400">Details</span></h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">✕</button>
        </div>

        <form onSubmit={onProceed} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-mono">Full Name</label>
            <input required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 uppercase text-xs font-bold text-white transition-all" 
              placeholder="YOUR NAME"
              onChange={(e) => setShippingData(prev => ({...prev, name: e.target.value}))} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-mono">Phone Number</label>
            <input required type="tel" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 uppercase text-xs font-bold text-white transition-all"
              placeholder="08XXXXXXXXXX"
              onChange={(e) => setShippingData(prev => ({...prev, phone: e.target.value}))} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-mono">Full Address</label>
            <textarea required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 uppercase text-xs font-bold text-white h-24 resize-none transition-all"
              placeholder="STREET NAME, HOUSE NUMBER, ETC."
              onChange={(e) => setShippingData(prev => ({...prev, address: e.target.value}))}></textarea>
          </div>
          
          <button type="submit" className="w-full bg-lime-400 text-black font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-white transition-all shadow-[0_0_20px_rgba(163,251,46,0.15)]">
            Confirm & Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;