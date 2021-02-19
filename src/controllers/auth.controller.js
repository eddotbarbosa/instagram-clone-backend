const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const hbs = require('nodemailer-express-handlebars');

const userModel = require('../models/user.model.js');

const nodemailerConfig = require('../configs/nodemailer.config.js');

const transporter = nodemailer.createTransport(nodemailerConfig.transporter);

transporter.use('compile', hbs({
  viewEngine: {
    layoutsDir: process.cwd() + '/src/views/mail/layouts',
    partialsDir: process.cwd() + '/src/views/mail/partials',
    defaultLayout: 'main',
    extname: '.hbs'
  },
  viewPath: process.cwd() + '/src/views/mail',
  extName: '.hbs'
}));

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

// change password
exports.changePassword = async function (req, res) {
  try {
    const auth = req.auth;

    const user = await userModel.findOne({_id: auth._id}).select('+password');
    if (!user) return res.json({result: 'user does not exist!'});

    if (!req.body.confirmPassword) return res.json({result: 'confirm the password!'});

    if (req.body.newPassword !== req.body.confirmPassword) return res.json({result: 'password and confirm password do not match!'});

    const comparePasswords = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!comparePasswords) return res.json({result: 'passwords do not match!'});

    user.password = req.body.newPassword;

    await user.save();

    res.json({result: 'password successfully changed!'});
  } catch (err) {
    res.json({error: err});
  }
};

// email verification
exports.sendEmailVerification = async function (req, res) {
  try {
    const auth = req.auth;

    const user = await userModel.findOne({_id: auth._id});
    if (!user) return res.json({result: 'user does not exist!'});

    if (user.isVerified) return res.json({result: 'email already verified!'});

    const token = crypto.randomBytes(20).toString('hex');

    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

    const mail = {
      from: 'instagramClone@email.com',
      to: user.email,
      subject: 'Instagram Clone Email Verification',
      template: 'emailVerification',
      context: {
        username: user.name,
        token: token,
        tokenExpiresAt: tokenExpiresAt.toString().slice(4, 24) + ' GMT-03:00'
      }
    };

    await transporter.sendMail(mail);

    user.emailVerificationToken.token = token;
    user.emailVerificationToken.expiresAt = tokenExpiresAt;

    await user.save();

    res.json({result: 'email verification successfully sended!'});
  } catch (err) {
    res.json({error: err});
  }
};

exports.emailVerification = async function (req, res) {
  try {
    const user = await userModel.findOne({'emailVerificationToken.token': req.body.token});
    if (!user) return res.json({result: 'invalid token!'});

    if (user.isVerified) return res.json({result: 'email already verified!'});

    const currentDate = new Date();
    if (currentDate > user.emailVerificationToken.expiresAt) return res.json({result: 'token has expired!'});

    user.emailVerificationToken.token = undefined;
    user.emailVerificationToken.expiresAt = undefined;
    user.isVerified = true;

    await user.save();

    res.json({result: 'email successfully verified!'});
  } catch (err) {
    res.json({error: err});
  }
};

// reset password
exports.sendResetPassword = async function (req, res) {
  try {
    const user = await userModel.findOne({email: req.body.email});
    if (!user) return res.json({result: 'user does not exist!'});

    const token = crypto.randomBytes(20).toString('hex');

    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

    const mail = {
      from: 'isntagramClone@email.com',
      to: user.email,
      subject: 'Instagram Clone Reset Password',
      template: 'resetPassword',
      context: {
        username: user.name,
        token: token,
        tokenExpiresAt: tokenExpiresAt
      }
    };

    await transporter.sendMail(mail);

    user.resetPasswordToken.token = token;
    user.resetPasswordToken.expiresAt = tokenExpiresAt;

    await user.save();

    res.json({result: 'reset password successfully sended!'});
  } catch (err) {
    res.json({error: err});
  }
};

exports.resetPassword = async function (req, res) {
  try {
    const user = await userModel.findOne({'resetPasswordToken.token': req.body.token});
    if (!user) return res.json({result: 'invalid token!'});

    if (req.body.password !== req.body.confirmPassword) return res.json({result: 'password and confirm password do not match!'});

    const currentDate = new Date();
    if (currentDate > user.resetPasswordToken.expiresAt) return res.json({result: 'token has expired!'});

    user.resetPasswordToken.token = undefined;
    user.resetPasswordToken.expiresAt = undefined;
    user.password = req.body.password;

    user.save();

    res.json({result: 'password successfully reseted!'});
  } catch (err) {
    res.json({error: err});
  }
};

// me
exports.me = async function (req, res) {
  try {
    const auth = req.auth;

    const user = await userModel.findOne({_id: auth._id}).select('username avatar');
    if (!user) return res.json({result: 'user does not exist!'});

    res.json({status: 'connected', user: user});
  } catch (err) {
    res.json({error: err});
  }
};
