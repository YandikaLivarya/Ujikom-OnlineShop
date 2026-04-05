import { useState } from "react"  
import axios from "axios"
import { useNavigate } from "react-router-dom"  

const Register = () => {
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration successful!");

      navigator('/Auth'); // Redirect to login page after successful registration 

    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed!");
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6 relative overflow-hidden">
  {/* Ornamen Background (Sama dengan Login agar Senada) */}
  <div className="absolute top-1/4 -right-20 w-96 h-96 bg-lime-400/10 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
 
  <div className="w-full max-w-md z-10">
    {/* Card Utama */}
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-2xl">
      
      {/* Header Register */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
          Join the <span className="text-lime-400">Club</span>
        </h1>
        <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.2em]">Create your skena account</p>
      </div>

      {/* Form Register */}
      {/* Tambahkan onSubmit di sini */}
<form className="space-y-5" onSubmit={handleSubmit}>
  
  {/* Input Full Name (Username) */}
  <div>
    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Full Name</label>
    <input 
      type="text" 
      name="username" // WAJIB ADA
      placeholder="Your Name" 
      value={formData.username} // Hubungkan ke state
      onChange={handleChange}   // Hubungkan ke fungsi pencatat
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
    />
  </div>

  {/* Input Email */}
  <div>
    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Email Address</label>
    <input 
      type="email" 
      name="email"
      placeholder="name@email.com" 
      value={formData.email}
      onChange={handleChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
    />
  </div>

  {/* Password */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Password</label>
      <input 
        type="password" 
        name="password"
        placeholder="••••••••" 
        value={formData.password}
        onChange={handleChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
      />
    </div>
    {/* Kolom Confirm Password bisa kamu tambahkan logic pengecekan nanti */}
    <div>
      <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Confirm</label>
      <input 
        type="password" 
        placeholder="••••••••" 
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
      />
    </div>
  </div>

  <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-lime-400 transition-all duration-300 shadow-[0_10px_20px_rgba(255,255,255,0.05)]">   Create Account
  </button>
</form>
    
      {/* Footer Register */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-xs">
          Already a member? 
          <a href='/Auth' className="text-lime-400 font-black uppercase ml-2 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  </div>
</section>
  )
}

export default Register
