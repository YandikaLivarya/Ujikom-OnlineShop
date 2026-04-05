import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DetailProduct() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addToCart = () => {
  // 1. Ambil data keranjang yang sudah ada di localStorage, atau buat array kosong jika belum ada
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  // 2. Cek apakah produk ini sudah ada di keranjang
  const isExist = existingCart.find((item) => item._id === product._id);

  if (isExist) {
    // Jika sudah ada, kita update jumlahnya (quantity)
    const updatedCart = existingCart.map((item) =>
      item._id === product._id ? { ...item, qty: item.qty + 1 } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  } else {
    // Jika belum ada, tambahkan produk baru dengan qty: 1
    const newCartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    };
    localStorage.setItem("cart", JSON.stringify([...existingCart, newCartItem]));
  }

  // 3. Beri notifikasi ke user dan trigger event untuk Navbar
  alert(`${product.name} added to bag! 🔥`);
  window.dispatchEvent(new Event("cartUpdated"));
};

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <p className="text-lime-400 font-black animate-pulse">LOADING GEAR...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <p className="text-red-500 font-black">PRODUCT NOT FOUND :/</p>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Tombol Back */}
        <button 
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          className="flex items-center gap-2 text-gray-500 hover:text-lime-400 transition mb-8 text-sm font-bold uppercase tracking-widest"
        >
          <span>←</span> Back to Collection
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* 1. BAGIAN KIRI: GALERI FOTO */}
          <div className="flex-1 space-y-4">
            <div className="aspect-[4/5] bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover shadow-2xl transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Thumbnail Foto Tambahan (Bisa dikembangkan nanti) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 transition">
                  <img src={product.image} alt="Angle" className="w-full h-full object-cover grayscale" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. BAGIAN KANAN: DETAIL PRODUK */}
          <div className="flex-1">
            <p className="text-lime-400 font-mono text-sm tracking-tighter mb-2 italic">
              // CATEGORY: {product.category || "UNSPECIFIED"}
            </p>
            <h1 className="text-5xl md:text-6xl font-black uppercase italic leading-[0.9] mb-4 tracking-tighter">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-light text-white/90 italic">
                IDR {product.price?.toLocaleString()}
              </span>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${product.stock > 0 ? "bg-white/10 text-lime-400" : "bg-red-500/20 text-red-500"}`}>
                {product.stock > 0 ? `In Stock [${product.stock}]` : "Out of Stock"}
              </span>
            </div>

            <hr className="border-white/10 mb-8" />

            {/* Deskripsi Dinamis */}
            <div className="space-y-4 mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Description</h3>
              <p className="text-gray-400 leading-relaxed max-w-lg">
                {product.description || "No description provided for this item."}
              </p>
            </div>

            {/* Pilihan Ukuran */}
            <div className="mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Select Size</h3>
              <div className="flex gap-3">
                {['All Size', 'M', 'L'].map((size) => (
                  <button key={size} className="border border-white/10 px-6 py-2 rounded-full text-xs font-black hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-all duration-300 uppercase">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Add to Cart */}
            <div className="flex gap-4">
              <button onClick={addToCart}
                disabled={product.stock <= 0}
                className={`flex-grow font-black py-5 rounded-2xl uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] ${
                  product.stock > 0 ? "bg-white text-black hover:bg-lime-400" : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                {product.stock > 0 ? "Add to Bag" : "Sold Out"}
              </button>
              <button className="px-6 border border-white/10 rounded-2xl hover:bg-white/5 transition group">
                <span className="group-hover:scale-125 block transition">❤️</span>
              </button>
            </div>

            {/* Info Tambahan */}
            <div className="mt-12 grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Shipping</p>
                <p className="text-xs text-gray-400 mt-1 uppercase italic font-bold">Free for club members.</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Material</p>
                <p className="text-xs text-gray-400 mt-1 uppercase italic font-bold">Cotton High Density.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DetailProduct;