import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // Tambahkan ini untuk mengelola input

function Auth() {
  // 1. Panggil hooks di top-level
  const navigate = useNavigate();
  
  // 2. Gunakan useState untuk menangkap input (cara yang lebih "React")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      alert("Login successful!");
      
      // Simpan token untuk session (Sangat penting buat Ujikom!)
      localStorage.setItem("token", response.data.token); 

      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      navigate('/'); 
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Periksa email atau password kamu.");
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ornamen Background */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-400/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
              Welcome <span className="text-lime-400">Back</span>
            </h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]">Enter your credentials</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update state saat diketik
                placeholder="name@email.com" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state saat diketik
                placeholder="••••••••" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
              />
              <div className="text-right mt-2">
                <a href="/forgot-password" alt="" className="text-[10px] text-gray-600 uppercase hover:text-lime-400">Forgot Password?</a>
              </div>
            </div>

            <button type="submit" className="w-full bg-lime-400 text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-white transition-all duration-300">
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Don't have an account? 
              <a href="/register" className="text-lime-400 font-black uppercase ml-2 hover:underline">Register</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;