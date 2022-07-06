const { celebrate, Joi } = require('celebrate');
const express = require('express');
const {
  getUsers,
  getUserByID,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { isURL } = require('../helpers/regex');

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);
usersRoutes.get('/me', getUserInfo);
usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserByID);
usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(isURL),
  }),
}), updateAvatar);

module.exports = { usersRoutes };
