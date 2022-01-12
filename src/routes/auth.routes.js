const express = require('express');

const authController = require('../controllers/auth.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

// sign in and sign out
router.post('/signin', authController.signIn);
router.post('/signout', authMiddleware.authentication, authController.signOut);

// change password
router.post('/change-password', authMiddleware.authentication, authController.changePassword);

// email verification
router.post('/send-email-verification', authMiddleware.authentication, authController.sendEmailVerification);
router.post('/email-verification', authController.emailVerification);

// reset password
router.post('/send-reset-password', authController.sendResetPassword);
router.post('/reset-password', authController.resetPassword);

// me
router.get('/me', authMiddleware.authentication, authController.me);

module.exports = router;
