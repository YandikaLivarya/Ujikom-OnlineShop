const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token
module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Ambil token dari header Authorization
    if (!token) return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    try {
        const verified = jwt.verify(token, 'RAHASIA_NEGARA');
        req.user = verified; // Simpan info user dari token ke req.user
        next();
    } catch (err) {
        res.status(400).json({ message: "Token tidak valid." });
    }       
};