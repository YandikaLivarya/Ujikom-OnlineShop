import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Katalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        // Ambil 4 produk terbaru saja untuk halaman utama
        setProducts(res.data.slice(0, 4));
      } catch (error) {
        console.error("Gagal load katalog:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="bg-[#0f0f0f] py-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-lime-400 font-mono text-sm mb-2 tracking-[0.2em]">// OUR ARCHIVE</p>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic leading-none">
              Featured <span className="text-outline">Drops</span>
            </h2>
          </div>
          <Link to="/collection" className="text-white border-b-2 border-lime-400 pb-1 text-sm font-bold uppercase tracking-widest hover:text-lime-400 transition transform hover:-translate-y-1">
            View All
          </Link>
        </div>

        {/* Product Grid Dinamis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item._id} className="group relative">
                {/* Box Gambar */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] rounded-2xl border border-white/5 transition-all duration-500 group-hover:border-lime-400/30 shadow-2xl">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay saat Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link 
                      to={`/detail-product/${item._id}`}
                      className="bg-white text-black font-black px-6 py-2 rounded-full text-[10px] uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-lime-400"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Label Badge Otomatis jika Stok Habis */}
                  {item.stock <= 0 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Info Produk */}
                <div className="mt-4 flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h3 className="text-white font-bold text-lg uppercase group-hover:text-lime-400 transition leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">
                      {item.category || "Limited Vol"}
                    </p>
                  </div>
                  <p className="text-lime-400 font-black text-lg italic">
                    {item.price ? `IDR ${item.price.toLocaleString()}` : "Contact for Price"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            /* Placeholder Loading */
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Katalog;