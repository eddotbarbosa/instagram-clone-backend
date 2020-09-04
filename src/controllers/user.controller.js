const userModel = require('../models/user.model.js');

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
    const user = await userModel.findOne({username: req.params.username})
      .populate({path: 'posts'});

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
