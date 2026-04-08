import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddressModal from '../Components/AddressModal'; // Pastikan sudah buat file ini

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const updateQty = (id, amount) => {
    const updated = cartItems.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.qty + amount);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const filtered = cartItems.filter(item => item._id !== id);
    setCartItems(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Fungsi yang dipicu saat form di Modal disubmit
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    // Simpan info alamat ke sessionStorage untuk dipakai di Payment.jsx
    sessionStorage.setItem("shippingInfo", JSON.stringify(shippingData));
    setIsModalOpen(false);
    navigate('/payment');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Cart */}
        <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-10">
          <h1 className="text-4xl font-black uppercase italic text-white">Your <span className="text-lime-400">Bag</span></h1>
          <p className="text-gray-500 font-mono text-sm">[ {cartItems.length < 10 ? `0${cartItems.length}` : cartItems.length} ITEMS ]</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            
            {/* 1. DAFTAR ITEM */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-6 bg-white/5 p-4 rounded-2xl border border-white/5 relative group">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-[#1a1a1a] rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} /> : <div className="w-full h-full flex items-center justify-center text-gray-600">-</div>}
                  </div>

                  <div className="flex flex-col justify-between py-2 w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold uppercase tracking-tight pr-4">{item.name}</h3>
                        <button onClick={() => removeItem(item._id)} className="text-gray-500 hover:text-red-500 transition text-[10px] font-black uppercase tracking-widest">Remove</button>
                      </div>
                      <p className="text-gray-500 text-xs mt-1 italic">Size: All Size</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-white/10 rounded-full px-3 py-1 gap-4 bg-black/20">
                        <button onClick={() => updateQty(item._id, -1)} className="text-gray-400 hover:text-lime-400 transition font-bold">-</button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, 1)} className="text-gray-400 hover:text-lime-400 transition font-bold">+</button>
                      </div>
                      <p className="font-black text-lime-400">IDR {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. RINGKASAN PEMBAYARAN */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-8 sticky top-24 sm:top-32">
                <h2 className="text-xl font-black uppercase mb-6 italic tracking-tighter">Order Summary</h2>
                
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-gray-400 uppercase tracking-tighter">
                    <span>Subtotal</span>
                    <span>IDR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 uppercase tracking-tighter">
                    <span>Shipping</span>
                    <span className="text-lime-400 uppercase text-[10px] font-black tracking-widest">Free</span>
                  </div>
                  <hr className="border-white/10 my-4" />
                  <div className="flex justify-between text-xl font-black italic uppercase">
                    <span>Total</span>
                    <span className="text-lime-400">IDR {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* TOMBOL CHECKOUT (Trigger Modal) */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-lime-400 text-black font-black py-4 rounded-xl mt-8 uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_10px_20px_rgba(163,251,46,0.15)] block text-center"
                >
                  Checkout Now
                </button>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Secure Payment Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
            <p className="text-gray-500 uppercase font-black italic text-xl mb-6">Your bag is empty <span className="text-lime-400">:/</span></p>
            <Link to="/collection" className="inline-block bg-white text-black px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-lime-400 transition">
              Back to Catalog
            </Link>
          </div>
        )}
      </div>

      {/* RENDER MODAL ALAMAT */}
      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProceed={handleProceedToPayment}
        setShippingData={setShippingData}
      />
    </section>
  );
}

export default Cart;