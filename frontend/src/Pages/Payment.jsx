import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../hooks/useApiUrl";

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'x-ngrok-skip-browser-warning': 'true',
};

function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [selectedMethod] = useState("ONLINE PAYMENT");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = useApiUrl();

  useEffect(() => {
    // 1. Ambil data keranjang dari localStorage
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    
    // 2. Ambil data alamat dari Modal (sessionStorage)
    const address = JSON.parse(sessionStorage.getItem("shippingInfo"));

    if (items.length === 0) {
      navigate('/collection');
      return;
    }

    setCartItems(items);
    setShippingInfo(address);
  }, [navigate]);

  // Hitung-hitungan Biaya
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const adminFee = 2000;
  const total = subtotal + adminFee;

  const handlePayment = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);

      // 1. Generate Nomor Resi Otomatis (Format: SKN-XXXXXX)
      const trackingNumber = Math.floor(Math.random() * 900000 + 100000);
      
      // 2. Buat Invoice di Xendit
      // Validasi data sebelum kirim
      if (!shippingInfo || !shippingInfo.name) {
        alert('❌ Shipping info tidak lengkap, silakan kembali ke cart');
        setIsLoading(false);
        return;
      }

      // Validasi nama customer
      const customerName = String(shippingInfo.name).trim();
      if (customerName.length < 2) {
        alert('❌ Nama customer minimal 2 karakter');
        setIsLoading(false);
        return;
      }

      // Format phone: harus dimulai dengan 0 atau 62
      let phone = shippingInfo.phone || '081234567890';
      if (!phone.match(/^(0|62)[0-9]{8,}/)) {
        // Jika format salah, gunakan default
        phone = '081234567890';
      }

      // Email: jika tidak ada atau tidak valid, gunakan placeholder
      let email = shippingInfo.email || 'customer@example.com';
      if (!email.includes('@') || email === 'noemail@example.com') {
        email = 'customer@example.com';
      }

      const payload = {
        amount: total,
        description: `Order SKN-${trackingNumber}`,
        customer_name: customerName,
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        tracking_number: trackingNumber,
        payment_method: selectedMethod,
      };

      console.log('📤 Sending payment request:', payload);

      let invoiceResponse;
      try {
        invoiceResponse = await fetch(`${API_URL}/api/payment/create-invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...NGROK_HEADERS,
          },
          body: JSON.stringify(payload),
        });
      } catch (fetchError) {
        console.error('❌ Fetch Error (Backend not reachable?):', fetchError.message);
        alert('❌ Cannot reach backend server. Make sure backend is running on port 5000!');
        setIsLoading(false);
        return;
      }

      console.log('📥 Response status:', invoiceResponse.status);

      if (!invoiceResponse.ok) {
        console.error('❌ HTTP Error:', invoiceResponse.status, invoiceResponse.statusText);
        const errorText = await invoiceResponse.text();
        console.error('Response body:', errorText);
        alert(`❌ Server Error ${invoiceResponse.status}: ${invoiceResponse.statusText}`);
        setIsLoading(false);
        return;
      }

      let invoiceData;
      try {
        invoiceData = await invoiceResponse.json();
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        alert('❌ Invalid response from server');
        setIsLoading(false);
        return;
      }

      console.log('📥 Backend response:', invoiceData);

      if (!invoiceData.success) {
        const errorMsg = invoiceData.error || invoiceData.message || 'Unknown error';
        console.error('❌ Invoice creation failed:', errorMsg);
        alert('❌ Gagal membuat invoice:\n' + errorMsg);
        setIsLoading(false);
        return;
      }

      console.log('✅ Invoice created successfully:', invoiceData.data.invoiceId);

      // 3. Simpan informasi invoice ke localStorage
      const orderDetails = {
        resi: `SKN-${trackingNumber}`,
        invoiceId: invoiceData.data.invoiceId,
        customer: shippingInfo,
        items: cartItems,
        totalPaid: total,
        method: selectedMethod,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: "Pending Payment"
      };

      // 3.5 SIMPAN ORDER KE DATABASE (UNTUK ADMIN DASHBOARD)
      try {
        // Ambil userId dari localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userData._id || userData.id;
        
        const orderPayload = {
          resi: `SKN-${trackingNumber}`,
          customer: {
            name: shippingInfo.name,
            email: email,
            phone: phone,
            city: shippingInfo.city,
            address: shippingInfo.address,
            userId: userId || null
          },
          items: cartItems,
          totalPaid: total,
          invoiceId: invoiceData.data.invoiceId,
          paymentMethod: selectedMethod
        };

        const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...NGROK_HEADERS,
          },
          body: JSON.stringify(orderPayload),
        });

        if (orderResponse.ok) {
          console.log('✅ Order saved to database successfully');
        } else {
          console.warn('⚠️ Order saved locally but not in database');
        }
      } catch (orderError) {
        console.warn('⚠️ Could not save order to database:', orderError.message);
        // Tetap lanjut ke payment meski gagal simpan ke database
      }

      localStorage.setItem("lastTrackingNumber", `SKN-${trackingNumber}`);
      localStorage.setItem("activeOrder", JSON.stringify(orderDetails));
      localStorage.setItem("invoiceId", invoiceData.data.invoiceId);

      // 4. Bersihkan data belanja
      localStorage.removeItem("cart"); 
      sessionStorage.removeItem("shippingInfo");
      
      // 5. Beritahu Navbar bahwa cart sudah kosong
      window.dispatchEvent(new Event("cartUpdated")); 

      // 6. Redirect ke URL Xendit untuk payment
      console.log('🔗 Redirecting to:', invoiceData.data.invoiceUrl);
      window.location.href = invoiceData.data.invoiceUrl;

    } catch (error) {
      console.error('❌ Unhandled Error:', error);
      alert('❌ Terjadi error: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 1. BAGIAN KIRI: KONFIRMASI ALAMAT & METODE PEMBAYARAN */}
          <div className="flex-[1.5] space-y-8">
            <div>
              <h1 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">
                Final <span className="text-lime-400">Step</span>
              </h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Review your order and finalize payment</p>
            </div>

            {/* BOX KONFIRMASI ALAMAT (Data dari Modal) */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group transition-all duration-500 hover:border-lime-400/30">
              <div className="absolute top-0 left-0 w-1 h-full bg-lime-400"></div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">// Shipping Destination</p>
              
              {shippingInfo ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                  <h4 className="font-bold uppercase text-lg text-white tracking-tight">{shippingInfo.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-medium">{shippingInfo.phone}</p>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[11px] text-white/60 uppercase italic leading-relaxed">
                      {shippingInfo.address}, {shippingInfo.city}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                   <p className="text-xs italic text-red-400 font-bold uppercase">Shipping data missing! Please return to cart.</p>
                </div>
              )}
            </div>

            {/* PILIHAN METODE PEMBAYARAN */}
            <div className="space-y-4">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Select Payment Method</p>

              <div
                className="p-6 bg-white/5 border rounded-2xl flex items-center justify-between transition-all duration-300 border-lime-400 bg-lime-400/5 shadow-[0_0_20px_rgba(163,251,46,0.05)]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all bg-lime-400 text-black">
                    💳
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-tight text-sm md:text-base">ONLINE PAYMENT</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Pay securely via QRIS, Virtual Account, or Credit Card</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors border-lime-400">
                  <div className="w-2.5 h-2.5 bg-lime-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. BAGIAN KANAN: RINGKASAN & ACTION */}
          <div className="flex-1">
            <div className="bg-[#151515] border border-white/10 rounded-[40px] p-8 md:p-10 sticky top-32 shadow-2xl">
              <h2 className="text-xl font-black uppercase mb-8 italic border-b border-white/5 pb-4 tracking-tighter">Order <span className="text-lime-400">Summary</span></h2>
              
              <div className="space-y-5 mb-8">
                <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center text-xs uppercase font-bold tracking-tighter">
                        <span className="text-gray-400">{item.qty}x {item.name}</span>
                        <span className="text-white">IDR {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    ))}
                </div>
                
                <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-[0.2em]">
                    <span className="text-gray-500">Shipping Fee</span>
                    <span className="text-lime-400 italic">FREE</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-[0.2em]">
                    <span className="text-gray-500">Service Admin</span>
                    <span className="text-white">IDR {adminFee.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-xl font-black italic uppercase tracking-tighter text-white">Total</span>
                  <span className="text-3xl font-black text-lime-400 tracking-tighter italic">IDR {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-lime-400 hover:bg-white hover:scale-[1.02]'} text-black font-black py-5 rounded-2xl uppercase tracking-widest text-sm active:scale-[0.98] transition-all duration-300 shadow-[0_15px_40px_rgba(163,251,46,0.2)]`}
              >
                {isLoading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
              </button>

              <div className="mt-8 flex flex-col items-center gap-2">
                 <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">Secure SSL Connection</p>
                 <div className="flex gap-4 opacity-20 grayscale">
                    <span className="text-xs font-black italic">VISA</span>
                    <span className="text-xs font-black italic">MASTERCARD</span>
                    <span className="text-xs font-black italic">JCB</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Payment;