const express = require('express');
const multer = require('multer');

const userController = require('../controllers/user.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');
const sharpMiddleware = require('../middlewares/sharp.middleware.js');

const multerConfig = require('../configs/multer.config.js');

const router = express.Router();

// feed
router.get('/feed', authMiddleware.authentication, userController.feed);

// user CRUD
router.post('/', userController.createUser);
router.get('/:username', userController.readUser);
router.put('/', authMiddleware.authentication, userController.updateUser);
router.delete('/', authMiddleware.authentication, userController.deleteUser);

// followers and following
router.post('/follow', authMiddleware.authentication, userController.followUser);
router.post('/unfollow', authMiddleware.authentication, userController.unfollowUser);

router.get('/:username/followers', userController.readFollowers);
router.get('/:username/following', userController.readFollowing);

// change avatar
router.put('/change-avatar', authMiddleware.authentication, multer(multerConfig.picture).single('picture'), sharpMiddleware.resize, userController.changeAvatar);

module.exports = router;

