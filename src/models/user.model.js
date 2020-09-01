const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, select: false},
  phone: {type: String},
  avatar: {type: String},
  biography: {type: String},
  gender: {type: String, lowercase: true, enum: ['male', 'female', 'not informed']},
  externalUrl: {type: String},
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  following: [{type: Schema.Types.ObjectId, ref: 'User'}],
  emailVerificationToken: {
    token: {type: String},
    expiresAt: {type: Date}
  },
  resetPasswordToken: {
    token: {type: String},
    expiresAt: {type: Date}
  },
  isVerified: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now}
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const encryptPassword = await bcrypt.hash(this.password, 10);

    this.password = encryptPassword;

    next();
  } catch (err) {
    next(err)
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
