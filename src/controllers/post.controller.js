const fs = require('fs');

const postModel = require('../models/post.model.js');
const userModel = require('../models/user.model.js');
const commentModel = require('../models/comment.model.js');

// post CRUD
exports.createPost = async function (req, res) {
  try {
    const auth = req.auth;

    const newPost = new postModel({
      author: auth._id,
      image: '/images/rs-' + req.file.filename,
      description: req.body.description || '',
      comments: [],
      likes: []
    });

    const post = await newPost.save();

    const user = await userModel.findOne({_id: auth._id});

    user.posts.push(post._id);

    await user.save();

    res.json(post);
  } catch (err) {
    res.json({error: err});
  }
};

exports.readPost = async function (req, res) {
  try {
    const post = await postModel.findOne({_id: req.params.post})
      .populate({path: 'author', select: 'username avatar'})
      .populate({path: 'comments', select: 'author comment createdAt', options: {sort: {createdAt: -1}}, populate: {path: 'author', select: 'username avatar'}});

    if (!post) return res.json({result: 'post does not exist!'});

    res.json(post);
  } catch (err) {
    res.json({error: err});
  }
};

exports.updatePost = async function (req, res) {
  try {
    const auth = req.auth;

    const post = await postModel.findOne({_id: req.body.post});
    if (!post) return res.json({result: 'post does not exist!'});

    if (post.author.toString() !== auth._id) return res.json({result: 'you are not the author of this post!'});

    post.description = req.body.description;

    await post.save();

    res.json(post);
  } catch (err) {
    res.json({error: err});
  }
};

exports.deletePost = async function (req, res) {
  try {
    const auth = req.auth;

    const post = await postModel.findOne({_id: req.body.post});
    if (!post) return res.json({result: 'post does not exist!'});

    if (post.author.toString() !== auth._id) return res.json({result: 'you are not the author of this post!'});

    if (post.comments) await commentModel.deleteMany({post: post._id});

    await postModel.deleteOne({_id: post._id});

    const user = await userModel.findOne({_id: auth._id});

    await user.posts.pull(post._id);

    await user.save();

    fs.unlinkSync(process.cwd() + '/src/tmp/uploads' + post.image);

    res.json({result: 'post successfully deleted!'});
  } catch (err) {
    res.json({error: err});
  }
};

// like
exports.likePost = async function (req, res) {
  try {
    const auth = req.auth;

    const post = await postModel.findOne({_id: req.body.post});

    if (!post.likes.includes(auth._id)) {
      post.likes.addToSet(auth._id);

      await post.save();

      return res.json({result: 'like successfully added on post!'});
    } else {
      post.likes.pull(auth._id);

      await post.save();

      return res.json({result: 'dislike successfully added on post!'});
    }
  } catch (err) {
    res.json({error: err});
  }
};

// List user posts
exports.listPosts = async function (req, res) {
  try {
    const user = await userModel.findOne({username: req.params.username});

    const posts = await postModel.find({author: user._id}).sort({createdAt: -1});

    return res.json(posts);
  } catch (err) {
    return res.json({error: err});
  }
}
