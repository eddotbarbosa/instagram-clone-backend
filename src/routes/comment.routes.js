const express = require('express');

const commentController = require('../controllers/comment.controller.js');

const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

// comment CRUD
router.post('/', authMiddleware.authentication, commentController.createComment);
router.get('/:comment', commentController.readComment);
router.put('/', authMiddleware.authentication, commentController.updateComment);
router.delete('/', authMiddleware.authentication, commentController.deleteComment);

module.exports = router;
