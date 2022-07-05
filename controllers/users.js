const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

const getUserByID = async (req, res, next) => {
  try {
    const userById = await User.findById(req.params.userId);
    if (!userById) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'BadRequestError') {
      next(new BadRequestError('Некорректный id пользователя'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'BadRequestError') {
      next(new BadRequestError('Некорректный id пользователя'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name, about, avatar, email, password: hash,
    });
    const createdUser = await user.save();
    res.status(200).send({
      message: {
        userId: createdUser._id,
        name: createdUser.name,
        about: createdUser.about,
        avatar: createdUser.avatar,
        email: createdUser.email,
      },
    });
  } catch (err) {
    if (err.name === 'BadRequestError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err.name === 'MongoServerError') {
      next(new ConflictError('Такой пользователь уже существует'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'BadRequestError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err.name === 'ConflictError') {
      next(new ConflictError('Такой пользователь уже существует'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'BadRequestError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Успешная авторизация' });
    })
    .catch(() => {
      next(new UnauthorizedError('Необходима авторизация'));
    });
};

module.exports = {
  getUsers,
  getUserByID,
  getUserInfo,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
