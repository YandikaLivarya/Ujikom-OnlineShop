const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth'); // WAJIB: Import middleware pembaca token

// 1. Publik (Bisa diakses siapa saja)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// 2. Private (Harus login/pakai middleware 'auth')
// Alamat: GET /api/auth/profile
router.get('/profile', auth, AuthController.getprofile);

// Alamat: PUT /api/auth/update (Sesuai panggilan axios.put di frontend)
router.put('/update', auth, AuthController.updateprofile);

// Alamat: PUT /api/auth/password (Sesuai panggilan axios.put di frontend)
router.put('/password', auth, AuthController.changepassword);

// 3. Admin Routes (User Management)
// Alamat: GET /api/auth/all-users
router.get('/all-users', AuthController.getAllUsers);

// Alamat: DELETE /api/auth/user/:userId
router.delete('/user/:userId', AuthController.deleteUser);

module.exports = router;