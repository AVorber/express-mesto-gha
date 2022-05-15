const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Ошибка сервера',
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userById = await User.findById(req.params.userId);
    if (!userById) {
      res.status(404).send({
        message: 'Пользователь не найден',
      });
      return;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Передан некорректный id пользователя',
      });
      return;
    }
    res.status(500).send({
      message: 'Ошибка сервера',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    res.status(200).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
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
      },
    );
    if (!updatedUser) {
      res.status(404).send({
        message: 'Пользователь не найден',
      });
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
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
      },
    );
    if (!updatedUser) {
      res.status(404).send({
        message: 'Пользователь не найден',
      });
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.errors.avatar.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
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
