const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Acak password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "User berhasil terdaftar!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        // Cek password cocok atau tidak
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password salah" });

        // Buat Token (Gelang Konser)
        const token = jwt.sign({ id: user._id }, 'RAHASIA_NEGARA', { expiresIn: '1d' });
        
        res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getprofile = async (req, res) => {
    try {
        const userId = req.user.id; // Dapatkan dari middleware auth
        const user = await User.findById(userId).select('-password'); // Kecuali password
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateprofile = async (req, res) => {
    try {
        const userId = req.user.id; // Dapatkan dari middleware auth
        const { username, email } = req.body;       
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true }
        ).select('-password'); // Kecuali password

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};
exports.changepassword = async (req, res) => {
    try {
        const userId = req.user.id; // Dapatkan dari middleware auth
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });    
        // Cek kecocokan password lama
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password lama salah" });
        // Hash password baru   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Password berhasil diubah" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users, total: users.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// DELETE USER (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        res.json({ success: true, message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
    