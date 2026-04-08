import { useState, useEffect, useRef } from "react";
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
    category: "Crew Socks"
  });
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const API_URL = useApiUrl();
  const formRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setPreviewUrl(editData.image);
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
        image: "",
        category: "Crew Socks",
      });
      setPreviewUrl("");
    }
    setFileSelected(null);
  }, [editData, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadFile = async () => {
    if (!fileSelected) {
      alert("Pilih file dulu!");
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', fileSelected);

    try {
      console.log('📤 Uploading file:', fileSelected.name);
      console.log('🔗 Upload endpoint:', `${API_URL}/api/upload`);
      
      const response = await axios.post(`${API_URL}/api/upload`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...NGROK_HEADERS,
        },
      });
      
      console.log('✅ Upload response:', response.data);
      
      if (response.data.imageUrl) {
        // Set image URL from uploaded file
        setFormData(prev => ({...prev, image: response.data.imageUrl}));
        setFileSelected(null);
        
        // Update preview URL immediately
        setPreviewUrl(response.data.imageUrl);
        
        alert("✅ Foto berhasil diupload!");
      } else {
        alert("❌ Server tidak return URL");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      console.error("Response:", error.response?.data);
      alert(`Gagal upload foto: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

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
      alert(`✅ Produk berhasil ${editData ? 'diupdate' : 'ditambahkan'}!`);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memproses data produk");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      {/* Konten Modal - Scrollable */}
      <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl rounded-[32px] relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header - Sticky */}
        <div className="flex-shrink-0 border-b border-white/10 p-6 flex justify-between items-start sticky top-0 bg-[#1a1a1a] bg-opacity-95 backdrop-blur-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-lime-400 font-mono tracking-[0.4em] uppercase">// Inventory/Control</p>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              {editData ? "Edit" : "Add New"} <span className="text-lime-400">Product</span>
            </h2>
          </div>
          <button onClick={onClose} className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition text-sm border border-white/5 flex-shrink-0">✕</button>
        </div>

        {/* Form - Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" id="productForm">
            
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

            {/* Input Gambar - FILE UPLOAD (Compact) */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Product Image</label>
              
              {/* File Upload UI - Compact */}
              <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-lime-400/50 transition">
                <input 
                  type="file" 
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fileInput" className="block cursor-pointer">
                  <div className="text-2xl mb-1">🖼️</div>
                  <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">
                    {fileSelected ? `✓ ${fileSelected.name}` : "Choose image file"}
                  </p>
                  <p className="text-[8px] text-gray-600 uppercase tracking-widest">(JPG, PNG • Max 5MB)</p>
                </label>

                {/* Upload Button */}
                {fileSelected && (
                  <button 
                    type="button"
                    onClick={handleUploadFile}
                    disabled={uploading}
                    className={`mt-2 px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition ${
                      uploading 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-lime-400 text-black hover:bg-white'
                    }`}
                  >
                    {uploading ? "⏳ Uploading..." : "📤 Upload"}
                  </button>
                )}
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                  </div>
                  <div className="text-[8px]">
                    <p className="text-gray-400 uppercase font-bold">✓ Image Ready</p>
                    <p className="text-gray-600 font-mono truncate">{formData.image?.split('/').pop()}</p>
                  </div>
                </div>
              )}

              {/* URL Input Fallback */}
              <input 
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Or paste URL..."
                className="w-full bg-white/5 border border-white/10 p-2 rounded-lg outline-none focus:border-lime-400 transition text-white text-[9px]"
              />
            </div>
          </form>
        </div>

        {/* Footer - Sticky Buttons */}
        <div className="flex-shrink-0 border-t border-white/10 p-6 bg-[#1a1a1a] bg-opacity-95 backdrop-blur-sm flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => formRef.current?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))}
            type="button"
            className="flex-1 px-4 py-3 rounded-xl bg-lime-400 text-black font-black text-sm uppercase tracking-widest hover:bg-white active:scale-95 transition-all shadow-[0_10px_30px_rgba(163,251,46,0.15)]"
          >
            {editData ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAddProduct;