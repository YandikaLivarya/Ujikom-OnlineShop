import { useState } from "react"  
import axios from "axios"
import { useNavigate } from "react-router-dom"  
import { useApiUrl } from "../hooks/useApiUrl"

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'x-ngrok-skip-browser-warning': 'true',
};

const Register = () => {
  const navigator = useNavigate();
  const API_URL = useApiUrl();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error saat user mulai ketik
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Jangan kirim confirmPassword ke backend
      const { confirmPassword, ...dataToSend } = formData;
      
      await axios.post(`${API_URL}/api/auth/register`, dataToSend, {
        headers: NGROK_HEADERS,
      });
      alert("Registration successful! 🎉");
      navigator('/Auth');
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  // Cek apakah password cocok
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;
  const isFormValid = formData.username && formData.email && formData.password && formData.confirmPassword && passwordsMatch;

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
      name="username"
      placeholder="Your Name" 
      value={formData.username}
      onChange={handleChange}
      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white outline-none transition ${
        errors.username ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-lime-400'
      }`}
    />
    {errors.username && <p className="text-red-400 text-[9px] mt-1 font-bold uppercase">{errors.username}</p>}
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
      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white outline-none transition ${
        errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-lime-400'
      }`}
    />
    {errors.email && <p className="text-red-400 text-[9px] mt-1 font-bold uppercase">{errors.email}</p>}
  </div>

  {/* Password */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Password</label>
      <input 
        type="password" 
        name="password"
        placeholder="••••••••" 
        value={formData.password}
        onChange={handleChange}
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white outline-none transition ${
          errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-lime-400'
        }`}
      />
      {errors.password && <p className="text-red-400 text-[9px] mt-1 font-bold uppercase">{errors.password}</p>}
    </div>
    
    {/* Confirm Password dengan validasi */}
    <div>
      <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest flex justify-between items-center">
        <span>Confirm</span>
        {passwordsMatch && formData.confirmPassword && <span className="text-lime-400 text-[8px]">✓ Match</span>}
      </label>
      <input 
        type="password" 
        name="confirmPassword"
        placeholder="••••••••" 
        value={formData.confirmPassword}
        onChange={handleChange}
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white outline-none transition ${
          passwordsDontMatch ? 'border-red-500 focus:border-red-500' : 
          passwordsMatch ? 'border-lime-400 focus:border-lime-400' : 
          'border-white/10 focus:border-lime-400'
        }`}
      />
      {errors.confirmPassword && <p className="text-red-400 text-[9px] mt-1 font-bold uppercase">{errors.confirmPassword}</p>}
      {passwordsMatch && !errors.confirmPassword && formData.confirmPassword && (
        <p className="text-lime-400 text-[9px] mt-1 font-bold uppercase">✓ Passwords match perfectly!</p>
      )}
    </div>
  </div>

  <button 
    type="submit" 
    disabled={!isFormValid}
    className={`w-full font-black py-4 rounded-xl uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_10px_20px_rgba(255,255,255,0.05)] ${
      isFormValid 
        ? 'bg-white text-black hover:bg-lime-400 cursor-pointer' 
        : 'bg-gray-600/30 text-gray-500 cursor-not-allowed opacity-50'
    }`}
  >
    {isFormValid ? 'Create Account' : 'Fill All Fields Correctly'}
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
