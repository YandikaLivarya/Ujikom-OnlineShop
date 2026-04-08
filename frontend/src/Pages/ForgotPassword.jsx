
function ForgotPassword() {
  return (
   <section className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6 relative overflow-hidden">
  {/* Ornamen Background (Sama dengan Login/Reg agar Senada) */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-blue-600/5 blur-[80px] sm:blur-[120px] md:blur-[150px] rounded-full"></div>

  <div className="w-full max-w-md z-10">
    {/* Card Utama */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl relative">
      {/* Icon Gembok Terkunci */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl">
          🔓
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
          Lost Your <span className="text-lime-400">Access?</span>
        </h1>
        <p className="text-gray-500 text-[10px] mt-3 uppercase tracking-[0.2em] leading-relaxed">
          Jangan panik. Masukkan email kamu dan kami akan kirimkan link untuk reset password.
        </p>
      </div>

      {/* Form Forgot Password */}
      <form className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Email Address</label>
          <input 
            type="email" 
            placeholder="name@email.com" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
          />
        </div>

        <button className="w-full bg-lime-400 text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 shadow-[0_10px_20px_rgba(217,249,157,0.1)]">
          Send Reset Link
        </button>
      </form>

      {/* Footer Card */}
      <div className="mt-10 text-center">
        <a href="/Auth" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-[0.2em] transition">
          ← Back to Sign In
        </a>
      </div>
    </div>

    {/* Info Tambahan */}
    <p className="text-center text-[10px] text-gray-700 mt-8 uppercase tracking-[0.3em]">
      Need more help? <span className="text-gray-500 cursor-pointer">Contact Support</span>
    </p>
  </div>
</section>
  )
}

export default ForgotPassword
