const express = require('express');
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');
const { NOT_FOUND_ERROR } = require('../controllers/errors');

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use((req, res, next) => {
  next(res.status(NOT_FOUND_ERROR).json({ message: 'Страница не найдена' }));
});

module.exports = { routes };
