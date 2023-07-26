const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); // Import the verifyToken middleware

router.get('/get-all-user', authController.getAllUsers);
router.post('/log-in', authController.login);
router.post('/sign-in', authController.createUser);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password', authController.resetPassword);
router.put('/edit-user', authController.editUser);
router.put('/change-password', authController.changePassword);
router.get('/protected', verifyToken, authController.protectedRoute);

module.exports = router;
