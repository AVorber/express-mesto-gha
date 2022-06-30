const bcrypt = require('bcrypt');
const User = require('../models/user');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } = require('./errors');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userById = await User.findById(req.params.userId);
    if (!userById) {
      res.status(NOT_FOUND_ERROR).send({
        message: 'Пользователь не найден',
      });
      return;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Передан некорректный id пользователя',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name, about, avatar, email, password: hash,
    });
    res.status(200).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const updateUser = async (req, res) => {
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
      res.status(NOT_FOUND_ERROR).send({
        message: 'Пользователь не найден',
      });
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const updateAvatar = async (req, res) => {
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
      res.status(NOT_FOUND_ERROR).send({
        message: 'Пользователь не найден',
      });
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.errors.avatar.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
};
