const fs = require('fs');

const userModel = require('../models/user.model.js');
const postModel = require('../models/post.model.js');

// user CRUD
exports.createUser = async function (req, res) {
  try {
    const newUser = new userModel({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone: '',
      avatar: '/images/default-avatar.png',
      biography: '',
      externalUrl: '',
      gender: 'not informed',
      posts: [],
      followers: [],
      following: []
    });

    const user = await newUser.save();

    res.json(user);
  } catch (err) {
    res.json({error: err});
  }
};

exports.readUser = async function (req, res) {
  try {
    const user = await userModel.findOne({username: req.params.username});

    if (!user) return res.json({result: 'user does not exist!'});

    res.json(user);
  } catch (err) {
    res.json({error: err});
  }
};

exports.updateUser = async function (req, res) {
  try {
    const auth = req.auth;

    const user = await userModel.findOne({_id: auth._id});
    if (!user) return res.json({result: 'user does not exist!'});

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.biography = req.body.biography || user.biography;
    user.externalUrl = req.body.externalUrl || user.externalUrl;
    user.gender = req.body.gender || user.gender;

    await user.save();

    res.json(user);
  } catch (err) {
    res.json({error: err});
  }
};

exports.deleteUser = async function (req, res) {
  try {
    const auth = req.auth;

    const user = await userModel.findOne({_id: auth._id});
    if (!user) return res.json({result: 'user does not exist!'});

    await userModel.deleteOne({_id: user._id});

    res.json({result: 'user successfully deleted!'});
  } catch (err) {
    res.json({error: err});
  }
};

// followers and following
exports.followUser = async function (req, res) {
  try {
    const auth = req.auth;

    const user =  await userModel.findOne({username: req.body.username});
    if (!user) return res.json({result: 'user does not exist!'});
    if (user._id.toString() === auth._id) return res.json({result: 'you cannot follow yourself!'});

    await userModel.updateOne({_id: auth._id}, {$addToSet: {following: user._id}});
    await userModel.updateOne({_id: user._id}, {$addToSet: {followers: auth._id}});

    res.json({result: 'user successfully followed!'});
  } catch (err) {
    res.json({error: err});
  }
};

exports.unfollowUser = async function (req, res) {
  try {
    const auth = req.auth;

    const user =  await userModel.findOne({username: req.body.username});
    if (!user) return res.json({result: 'user does not exist!'});
    if (user._id.toString() === auth._id) return res.json({result: 'you cannot unfollow yourself!'});

    await userModel.updateOne({_id: auth._id}, {$pull: {following: user._id}});
    await userModel.updateOne({_id: user._id}, {$pull: {followers: auth._id}});

    res.json({result: 'user successfully unfollowed!'});
  } catch (err) {
    res.json({error: err});
  }
};

exports.readFollowers = async function (req, res) {
  try {
    const user = await userModel.findOne({username: req.params.username})
      .select('followers')
      .populate({path: 'followers', select: 'username avatar name'});

    res.json(user);
  } catch (err) {
    res.json({error: err});
  }
};

exports.readFollowing = async function (req, res) {
  try {
    const user = await userModel.findOne({username: req.params.username})
      .select('following')
      .populate({path: 'following', select: 'username avatar name'});

    res.json(user);
  } catch (err) {
    res.json({error: err});
  }
};

// change avatar
exports.changeAvatar = async function (req, res) {
  try {
    const auth = req.auth;

    const user = await userModel.findOne({_id: auth._id});
    if (!user) return res.json({result: 'user does not exist!'});

    if (user.avatar == '/images/default-avatar.png') {
      user.avatar = '/images/rs-' + req.file.filename;

      await user.save();

      return res.json({result: 'avatar successfully updated!'});
    }

    if (!fs.existsSync(process.cwd() + '/src/tmp/uploads/' + user.avatar)) {
      fs.unlinkSync(process.cwd() + '/src/tmp/uploads/images/rs-' + req.file.filename);

      user.avatar = '/images/default-avatar.png';

      await user.save();

      return res.json({result: 'an error has occurred and the avatar has been set to default please try again!'});
    }

    fs.unlinkSync(process.cwd() + '/src/tmp/uploads/' + user.avatar);

    user.avatar = '/images/rs-' + req.file.filename;

    await user.save();

    res.json({result: 'avatar successfully updated!'});
  } catch (err) {
    res.json({error: err});
  }
};

// feed
exports.feed = async function (req, res) {
  try {
    const auth = req.auth;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (page < 0 || limit < 0) return res.json({result: 'page or limit values cannot be negative!'});

    const user = await userModel.findOne({_id: auth._id}).select('following');
    if (!user) return res.json({result: 'user does not exist!'});

    const feedCount = await postModel.countDocuments({author: [user._id, ...user.following]});

    const paging = {
      previous: (page === 1) ? 'no previous' : 'page=' + (page - 1) + '&limit=' + limit,
      next: ((page * limit) >= feedCount) ? 'no next' : 'page=' + (page + 1) + '&limit=' + limit,
      pages: Math.ceil(feedCount / limit)
    };

    const feed = await postModel.find({author: [user._id, ...user.following]})
      .populate({path: 'author', select: 'username avatar'})
      .populate({path: 'comments', populate: {path: 'author', select: 'username avatar'}})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    res.json({paging: paging, result: feed});
  } catch (err) {
    res.json({error: err});
  }
};
