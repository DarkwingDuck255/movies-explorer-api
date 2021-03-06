const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user');
const BadRequest = require('../utils/bad-request');
const NotFound = require('../utils/not-found');
const DefaultError = require('../utils/default-error');
const EmailRegErr = require('../utils/email-reg-err');
const SigninErr = require('../utils/signin-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => users.findById(req.user._id)
  .orFail(new NotFound('Пользователь не найден'))
  .then((user) => res.status(200).send({ user }))
  .catch((err) => {
    next(err);
  });

const postUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => users.create({
      name, email, password: hash,
    }))
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new EmailRegErr('Этот email уже зарегистрирован!'));
      } else {
        next(new DefaultError('На сервере произошла ошибка'));
      }
    });
};

const patchUser = (req, res, next) => {
  const { name, email } = req.body;

  return users.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при изменении пользователя'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Невалидный id'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return users.findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'DarkwingDuck255%'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new SigninErr('Неверный логин или пароль'));
    });
};

module.exports = {
  getCurrentUser, postUser, patchUser, login,
};
