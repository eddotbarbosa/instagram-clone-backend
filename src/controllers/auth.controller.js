const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model.js');

// sign in and sign out
exports.signIn = async function (req, res) {
  try {
    const user = await userModel.findOne({email: req.body.email}).select('+password');
    if (!user) return res.json({result: 'user does not exist!'});

    const comparePasswords = await bcrypt.compare(req.body.password, user.password);
    if (!comparePasswords) return res.json({result: 'passwords do not match!'});

    const token = jwt.sign({_id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '15m'});

    res.json({token: token});
  } catch (err) {
    res.json({error: err});
  }
};

exports.signOut = async function (req, res) {
  try {
    //it's a simple start, later add the tokens to a blacklist and etc
    res.removeHeader('Authorization');

    res.json({result: 'user successfully signed out!'});
  } catch (err) {
    res.json({error: err});
  }
};
