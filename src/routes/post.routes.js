const express = require('express');
const multer = require('multer');

const postController = require('../controllers/post.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');
const sharpMiddleware = require('../middlewares/sharp.middleware.js');

const multerConfig = require('../configs/multer.config.js');

const router = express.Router();

// post CRUD
router.post('/', authMiddleware.authentication, multer(multerConfig.picture).single('picture'), sharpMiddleware.resize, postController.createPost);
router.get('/:post', postController.readPost);
router.put('/', authMiddleware.authentication, postController.updatePost);
router.delete('/', authMiddleware.authentication, postController.deletePost);

// like
router.post('/like', authMiddleware.authentication, postController.likePost);

// Get user posts
router.get('/list/:username', postController.listPosts);

module.exports = router;
