const mongoose = require('mongoose');
// const validator = require('validator');
// const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const SigninErr = require('../utils/signin-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Невалидный email',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.statics.findOneByCredentials = function (email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new SigninErr('Пользователь не найден');
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new SigninErr('Неправильный email или пароль');
          }

          return user;
        });
    });
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
module.exports = mongoose.model('users', userSchema);
