const commentModel = require('../models/comment.model.js');
const postModel = require('../models/post.model.js');

// comment CRUD
exports.createComment = async function (req, res) {
  try {
    const auth = req.auth;

    const post = await postModel.findOne({_id: req.body.post});
    if (!post) return res.json({result: 'the post that you want add a comment does not exist!'});

    const newComment = new commentModel({
      author: auth._id,
      post: post._id,
      comment: req.body.comment
    });

    const comment = await newComment.save();

    post.comments.addToSet(comment._id);

    await post.save();

    res.json(comment);
  } catch (err) {
    res.json({error: err});
  }
};

exports.readComment = async function (req, res) {
  try {
    const comment = await commentModel.findOne({_id: req.params.comment});
    if (!comment) return res.json({result: 'comment does not exist!'});

    res.json(comment);
  } catch (err) {
    res.json({error: err});
  }
};

exports.updateComment = async function (req, res) {
  try {
    const auth = req.auth;

    if (!req.body.comment) return res.json({result: 'comment field cannot be empty!'});

    const comment = await commentModel.findOne({_id: req.body.commentId});
    if (!comment) return res.json({result: 'comment does not exist!'});
    if (comment.author.toString() !== auth._id) return res.json({result: 'you are not the author of this comment!'});

    comment.comment = req.body.comment;

    await comment.save();

    res.json(comment);
  } catch (err) {
    res.json({error: err});
  }
};

exports.deleteComment = async function (req, res) {
  try {
    const auth = req.auth;

    const comment = await commentModel.findOne({_id: req.body.comment})
      .populate({path: 'post', select: 'author'});

    if (!comment) return res.json({result: 'comment does not exist!'});

    if (auth._id === comment.author.toString() || auth._id === comment.post.author.toString()) {
      await postModel.updateOne({_id: comment.post._id}, {$pull: {comments: comment._id}});

      await commentModel.deleteOne({_id: comment._id});

      return res.json({result: 'comment successfully deleted!'});
    } else {
      return res.json({result: 'you don\'t have permission to delete this comment!'});
    }
  } catch (err) {
    res.json({error: err});
  }
};
