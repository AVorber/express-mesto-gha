const { celebrate, Joi } = require('celebrate');
const express = require('express');
const {
  getUsers,
  getUserByID,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userid: Joi.string().hex().length(24),
  }),
}), getUserByID);
usersRoutes.get('/me', express.json(), getUserInfo);
usersRoutes.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
usersRoutes.patch('/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?):\/\/[^\s$.?#].[^\s]*$/m),
  }),
}), updateAvatar);

module.exports = { usersRoutes };
