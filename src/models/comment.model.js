const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
  comment: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
