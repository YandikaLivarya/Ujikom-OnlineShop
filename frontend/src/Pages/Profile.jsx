import { useState, useEffect } from 'react';
import axios from 'axios';
import UserOrderHistory from '../Components/UserOrderHistory';

const Profile = () => {
    const [user, setUser] = useState({ username: '', email: '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Gagal ambil profil");
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/auth/update', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            localStorage.setItem('user', JSON.stringify(res.data));
            // Trigger biar Navbar ganti nama tanpa refresh
            window.dispatchEvent(new Event("userDataUpdated"));
            alert("Profile Updated! 🔥");
        } catch (err) {
            alert("Gagal update profil");
        } finally { setLoading(false); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/password', passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Password changed successfully!");
            setPasswords({ oldPassword: '', newPassword: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Gagal ganti password");
        }
    };

    return (
        <section className="min-h-screen bg-[#0f0f0f] text-white pt-40 px-6 pb-20">
            <div className="max-w-6xl mx-auto">
                
                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 font-black uppercase text-xs tracking-widest transition-all ${
                            activeTab === 'profile'
                                ? 'text-lime-400 border-b-2 border-lime-400'
                                : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        Profile Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 font-black uppercase text-xs tracking-widest transition-all ${
                            activeTab === 'orders'
                                ? 'text-lime-400 border-b-2 border-lime-400'
                                : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        Order History
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
                            <h2 className="text-xl font-black uppercase italic mb-6 tracking-tighter text-lime-400">General Info</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Username</label>
                                    <input type="text" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-lime-400 outline-none transition" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Email</label>
                                    <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-lime-400 outline-none transition" />
                                </div>
                                <button className="w-full bg-white text-black font-black py-3 rounded-xl uppercase text-xs hover:bg-lime-400 transition">{loading ? "Saving..." : "Update Profile"}</button>
                            </form>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
                            <h2 className="text-xl font-black uppercase italic mb-6 tracking-tighter text-red-500">Security</h2>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <input type="password" placeholder="Old Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition" />
                                <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition" />
                                <button className="w-full bg-red-500 text-white font-black py-3 rounded-xl uppercase text-xs hover:bg-white hover:text-red-500 transition">Change Password</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
                        <UserOrderHistory />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Profile;