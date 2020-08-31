const express = require('express');

const authController = require('../controllers/auth.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

// sign in and sign out
router.post('/signin', authController.signIn);
router.post('/signout', authMiddleware.authentication, authController.signOut);

// change password
router.post('/change-password', authMiddleware.authentication, authController.changePassword);

module.exports = router;
