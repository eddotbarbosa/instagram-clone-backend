const express = require('express');

const userController = require('../controllers/user.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

// user CRUD
router.post('/', userController.createUser);
router.get('/:username', userController.readUser);
router.put('/', authMiddleware.authentication, userController.updateUser);
router.delete('/', authMiddleware.authentication, userController.deleteUser);

module.exports = router;

