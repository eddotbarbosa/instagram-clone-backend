const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  image: {type: String, required: true},
  description: {type: String},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  createdAt: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
