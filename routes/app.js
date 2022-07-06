const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');
const NotFoundError = require('../errors/not-found-error');
const { login, createUser } = require('../controllers/users');
const { isURL } = require('../helpers/regex');
const auth = require('../middlewares/auth');

const routes = express.Router();

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(isURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

routes.use(auth);
routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = { routes };
