import { useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../hooks/useApiUrl";

const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "x-ngrok-skip-browser-warning": "true",
};

function ModalAddProduct({ isOpen, onClose, onRefresh, editData }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    category: "Crew Socks" // Default category agar tidak kosong
  });
  const API_URL = useApiUrl();

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
        image: "",
        category: "Crew Socks",
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editData) {
        await axios.put(`${API_URL}/api/products/${editData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...NGROK_HEADERS,
          },
        });
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...NGROK_HEADERS,
          },
        });
      }
      onRefresh();
      onClose();
    } catch (error) {
      alert("Gagal memproses data produk");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      {/* Konten Modal */}
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-xl rounded-[32px] p-8 relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-[10px] text-lime-400 font-mono tracking-[0.4em] uppercase">// Inventory/Control</p>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              {editData ? "Edit" : "Add New"} <span className="text-lime-400">Product</span>
            </h2>
          </div>
          <button onClick={onClose} className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition text-sm border border-white/5">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input Nama */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Product Name</label>
            <input required value={formData.name} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 transition text-white text-sm" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Cyber Checker Socks" />
          </div>

          {/* Input Kategori (DROPDOWN) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Product Category</label>
            <select 
              required 
              value={formData.category} 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 transition text-white text-sm uppercase font-bold appearance-none cursor-pointer"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Crew Socks" className="bg-[#1a1a1a]">Crew Socks</option>
              <option value="Ankle Socks" className="bg-[#1a1a1a]">Ankle Socks</option>
              <option value="Limited Edition" className="bg-[#1a1a1a]">Limited Edition</option>
            </select>
          </div>

          {/* Input Harga */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Price (IDR)</label>
            <input required type="number" value={formData.price} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 transition text-white text-sm" 
              onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="85000" />
          </div>

          {/* Input Stok */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Stock</label>
            <input required type="number" value={formData.stock} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 transition text-white text-sm" 
              onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="50" />
          </div>

          {/* Input Gambar */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Image URL</label>
            <div className="flex gap-4 items-center">
                <input required value={formData.image} className="flex-grow bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-lime-400 transition text-white text-sm" 
                onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                {formData.image && (
                  <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img src={formData.image} className="w-full h-full object-cover" alt="preview" />
                  </div>
                )}
            </div>
          </div>

          {/* Button Submit */}
          <button type="submit" className="md:col-span-2 w-full bg-lime-400 text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-white active:scale-95 transition-all shadow-[0_10px_30px_rgba(163,251,46,0.15)] mt-4">
            {editData ? "Update Product" : "Publish Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalAddProduct;