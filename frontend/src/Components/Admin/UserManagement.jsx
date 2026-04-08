import { useState, useEffect } from 'react';
import { useApiUrl } from '../../hooks/useApiUrl';

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'x-ngrok-skip-browser-warning': 'true',
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const API_URL = useApiUrl();

  // Fetch semua users dari backend
  useEffect(() => {
    fetchUsers();
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/all-users`, {
        headers: NGROK_HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch users');

      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Yakin ingin menghapus user "${username}"?`)) {
      try {
        const response = await fetch(`${API_URL}/api/auth/user/${userId}`, {
          method: 'DELETE',
          headers: NGROK_HEADERS,
        });

        if (!response.ok) throw new Error('Failed to delete user');

        const result = await response.json();
        if (result.success) {
          setUsers(users.filter(user => user._id !== userId));
          setSuccessMessage(`✅ User "${username}" berhasil dihapus!`);
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        console.error('❌ Error deleting user:', err);
        setError('Gagal menghapus user');
      }
    }
  };

  // Filter users berdasarkan search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistik User
  const stats = {
    totalUsers: users.length,
    newUsersThisMonth: users.filter(user => {
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      return now.getMonth() === createdDate.getMonth() && 
             now.getFullYear() === createdDate.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin">⏳</div>
          <p className="text-gray-400 mt-4">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* STATISTIK USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-lime-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-lime-400/60 transition">
          <p className="text-gray-400 text-sm font-mono">👥 TOTAL USER</p>
          <p className="text-3xl font-black text-lime-400 mt-2">{stats.totalUsers}</p>
          <p className="text-xs text-gray-500 mt-2">Registered users</p>
        </div>
        
        <div className="bg-white/5 border border-blue-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/60 transition">
          <p className="text-gray-400 text-sm font-mono">📅 BULAN INI</p>
          <p className="text-3xl font-black text-blue-400 mt-2">{stats.newUsersThisMonth}</p>
          <p className="text-xs text-gray-500 mt-2">New registrations</p>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm font-mono animate-pulse">
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-mono">
          ❌ {error}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Cari user by username atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition"
        />
        <button
          onClick={fetchUsers}
          className="bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-gray-400 hover:text-white transition"
          title="Refresh data"
        >
          🔄
        </button>
      </div>

      {/* USER TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            {/* TABLE HEADER */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-widest">No</th>
                <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-widest">Username</th>
                <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-widest">Join Date</th>
                <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-widest">Action</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <p className="text-sm">Tidak ada user ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      {index + 1}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="bg-lime-400/10 text-lime-400 px-3 py-1 rounded-lg text-xs font-black">
                        @{user.username}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-gray-300 text-xs">
                      {user.email}
                    </td>
                    
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user._id, user.username)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 hover:border-red-500 text-red-400 px-3 py-1 rounded-lg text-xs font-black transition"
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-500 text-center">
        <p className="font-mono">
          Menampilkan <span className="text-lime-400 font-black">{filteredUsers.length}</span> dari <span className="text-lime-400 font-black">{users.length}</span> total user
        </p>
      </div>
    </div>
  );
}

export default UserManagement;
