import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useApiUrl } from "../hooks/useApiUrl";

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'x-ngrok-skip-browser-warning': 'true',
};

function Collection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State untuk hasil filter
  const [activeCategory, setActiveCategory] = useState("All Items");
  const API_URL = useApiUrl();
  const placeholderImage = "https://placehold.co/400x400/1a1a1a/ffffff?text=Socks";
  const getProductImageSrc = (image) =>
    `${API_URL}/uploads/${image.split("/").pop().split("?")[0]}?ngrok-skip-browser-warning=true`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`, {
          headers: NGROK_HEADERS,
        });
        setProducts(res.data);
        setFilteredProducts(res.data); // Awalnya tampilkan semua
      } catch (error) {
        console.error("Gagal load produk:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fungsi Filter Kategori
  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === "All Items") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item => item.category === category);
      setFilteredProducts(filtered);
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Katalog */}
        <div className="mb-12 border-b border-white/5 pb-10">
          <p className="text-lime-400 font-mono text-xs mb-2 tracking-[0.3em]">// ARCHIVE 2026</p>
          <h1 className="text-6xl font-black uppercase italic leading-none">
            Full <span className="text-outline">Collection</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 1. SIDEBAR FILTER (Kiri) */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Categories</h4>
              <ul className="space-y-3">
                {['All Items', 'Crew Socks', 'Ankle Socks', 'Limited Edition'].map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => handleFilter(cat)}
                      className={`text-sm font-bold transition uppercase tracking-tight flex justify-between w-full group ${
                        activeCategory === cat ? "text-lime-400" : "text-gray-400 hover:text-lime-400"
                      }`}
                    >
                      {cat} <span className={`transition ${activeCategory === cat ? "opacity-100" : "opacity-20 group-hover:opacity-100"}`}>→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Vibe Color</h4>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-lime-400 border border-white/20 cursor-pointer hover:scale-110 transition"></div>
                <div className="w-6 h-6 rounded-full bg-blue-600 border border-white/20 cursor-pointer hover:scale-110 transition"></div>
                <div className="w-6 h-6 rounded-full bg-white border border-white/20 cursor-pointer hover:scale-110 transition"></div>
                <div className="w-6 h-6 rounded-full bg-black border border-white/40 cursor-pointer hover:scale-110 transition"></div>
              </div>
            </div>

            <div className="bg-lime-400 p-6 rounded-2xl rotate-[-2deg] shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]">
              <p className="text-black font-black text-xl leading-tight uppercase">Get 20% Off for Club Members</p>
              <button className="mt-4 text-[10px] font-black uppercase border-b-2 border-black pb-1 hover:tracking-widest transition-all">Join Now</button>
            </div>
          </aside>

          {/* 2. GRID PRODUK (Kanan) */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-medium text-gray-500 italic">Showing {filteredProducts.length} results</p>
              <select className="bg-transparent text-xs font-bold uppercase outline-none cursor-pointer text-white">
                <option className="bg-[#0f0f0f]">Newest First</option>
                <option className="bg-[#0f0f0f]">Price: Low to High</option>
                <option className="bg-[#0f0f0f]">Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <div key={item._id} className="group cursor-pointer">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a] rounded-2xl border border-white/5 transition-all duration-500 group-hover:border-lime-400/50">
                      {item.image ? (
                        <img 
                          src={getProductImageSrc(item.image)} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImage;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-600">No Image</div>
                      )}
                      <Link 
                        to={`/detail-product/${item._id}`}
                        className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold uppercase tracking-tight group-hover:text-lime-400 transition pr-2">
                          {item.name}
                        </h3>
                        <p className="font-black text-sm text-lime-400 whitespace-nowrap">
                          IDR {item.price?.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 font-bold">
                        {item.category || "Limited Release"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-gray-500 uppercase font-black italic text-xl tracking-tighter">
                    No items found in <span className="text-lime-400">{activeCategory}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Collection;