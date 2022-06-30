const Card = require('../models/card');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } = require('./errors');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(200).send(await card.save());
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

const deleteCardById = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
    if (!deletedCard) {
      res.status(NOT_FOUND_ERROR).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    if (!deletedCard.owner.toString().equals(req.user._id)) {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Нельзя удалять карточки других пользователей',
      });
      return;
    }
    res.status(200).send(await deletedCard.deleteOne());
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Передан некорректный id карточки',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const addLike = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      res.status(NOT_FOUND_ERROR).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Передан некорректный id карточки',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

const deleteLike = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      res.status(NOT_FOUND_ERROR).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({
        message: 'Передан некорректный id карточки',
      });
      return;
    }
    res.status(SERVER_ERROR).send({
      message: 'Ошибка сервера',
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
