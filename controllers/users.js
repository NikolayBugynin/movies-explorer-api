const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { InvalidError, RegisterError, NotFoundError } = require('../errors');
const { HTTP_STATUS_CREATED, MONGODB_CONFLICT } = require('../utils/constants');
const { JWT_SECRET } = require('../utils/config');

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFoundError('Пользователь по указанному _id не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new RegisterError('Пользователь с таким именем уже существует'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => { throw new NotFoundError('Пользователь по указанному _id не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === MONGODB_CONFLICT) {
        return next(new RegisterError());
      }
      if (err.name === 'ValidationError') {
        return next(new InvalidError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.signOut = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    return res.send({ message: 'Вы успешно вышли из аккаунта' });
  } catch (error) {
    return next(error);
  }
};
