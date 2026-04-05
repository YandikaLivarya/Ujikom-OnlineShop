import { useState, useEffect } from "react"
import axios from "axios"
import ModalAddProduct from "../../Components/ModalAddProduct"

function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Menampung data yang akan diedit

  // Ambil data produk
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Gagal load inventory");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler Buka Modal Tambah
  const handleAddNew = () => {
    setSelectedProduct(null); // Pastikan data kosong
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleEdit = (product) => {
    setSelectedProduct(product); // Masukkan data produk ke state
    setIsModalOpen(true);
  };

  // Handler Hapus Produk
  const deleteProduct = async (id) => {
    if (window.confirm("Yakin mau hapus produk skena ini?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        alert("Gagal hapus");
      }
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Modal yang sudah disempurnakan */}
        <ModalAddProduct 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchProducts} 
          editData={selectedProduct} 
        />

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Admin <span className="text-lime-400">Inventory</span>
          </h1>
          <button 
            onClick={handleAddNew}
            className="bg-lime-400 text-black font-black px-6 py-2 rounded-lg text-xs uppercase hover:bg-white transition"
          >
            + Add New Sock
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Total Products</p>
            <p className="text-4xl font-black tracking-tighter">{products.length}</p>
          </div>
          {/* Tambahkan stats lain jika perlu */}
        </div>

        {/* Tabel Inventory */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {products.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition group">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10">
                      <img src={item.image} className="object-cover w-full h-full" alt={item.name} />
                    </div>
                    <span className="font-bold uppercase tracking-tighter">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">{item.stock} Pair</td>
                  <td className="px-6 py-4 font-mono text-lime-400 font-bold">IDR {item.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right space-x-6">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteProduct(item._id)}
                      className="text-red-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Inventory;