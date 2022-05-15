const express = require('express');
const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', express.json(), createCard);
cardsRoutes.delete('/:cardId', deleteCardById);
cardsRoutes.put('/:cardId/likes', addLike);
cardsRoutes.delete('/:cardId/likes', deleteLike);

module.exports = { cardsRoutes };
