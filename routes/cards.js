const express = require('express');
const {
  getCards,
  createCard,
  deleteCardById,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', getCards);
cardsRoutes.get('/', express.json(), createCard);
cardsRoutes.get('/:cardId', deleteCardById);

module.exports = { cardsRoutes };
