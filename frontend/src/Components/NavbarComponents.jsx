import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

function NavbarComponents() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState (0)

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((acc, item) => acc + item.qty, 0);
    setCartCount(total);
  }
  
  useEffect(()=>{
    updateCartCount ();
    window.addEventListener("cartUpdated",updateCartCount);
    return () => window.removeEventListener("cartUpdated",updateCartCount);
  },[]);

  const syncUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("userDataUpdated", syncUser); // Untuk update instan
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userDataUpdated", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  // Helper untuk styling Link Aktif
  const activeStyle = ({ isActive }) => 
    `px-5 py-2 block text-[12px] uppercase tracking-widest font-bold transition-all duration-300 rounded-full ${
      isActive ? "text-lime-400 bg-white/5" : "text-white/50 hover:text-white"
    }`;

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4">
      <nav className="bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl px-8 py-3 flex items-center justify-between w-full max-w-5xl transition-all hover:border-lime-400/50">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
            <span className="text-black font-black text-xs">S*S</span>
          </div>
          <span className="font-black text-white tracking-tighter text-xl italic uppercase">S*ckSocks</span>
        </Link>

        {/* Menu Tengah */}
        <ul className="hidden md:flex bg-white/5 border border-white/10 rounded-full px-2 py-1 gap-1">
          <li><NavLink to="/" className={activeStyle}>Drop</NavLink></li>
          <li><NavLink to="/collection" className={activeStyle}>Collection</NavLink></li>
          <li><NavLink to="/track-package" className={activeStyle}>Track Package</NavLink></li>
        </ul>

        {/* Kanan */}
        <div className="flex items-center gap-6">
      <Link to="/cart" className="relative text-white/80 hover:text-lime-400 transition">
  <span className="text-sm font-bold uppercase tracking-tighter">Cart</span>
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-lime-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-sm">
      {cartCount < 10 ? `0${cartCount}` : cartCount}
    </span>
  )}
</Link>
          <div className="h-4 w-[1px] bg-white/20"></div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 pl-2 pr-4 py-1.5 rounded-full hover:border-lime-400 transition"
              >
                <div className="w-7 h-7 bg-lime-400 rounded-full flex items-center justify-center text-black font-black text-[10px]">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">{user.username}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-44 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden">
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-lime-400 hover:bg-white/5 transition">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="bg-lime-400 hover:bg-white text-black px-5 py-1.5 rounded-full text-xs font-black uppercase transition-colors">
              Join Club
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponents;