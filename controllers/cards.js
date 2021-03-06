const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const cardById = await Card.findById(req.params.cardId);
    if (!cardById) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    if (cardById.owner.toString() !== req.user._id) {
      next(new ForbiddenError('Нельзя удалять карточки других пользователей'));
      return;
    }
    res.status(200).send(await cardById.deleteOne());
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }
    next(err);
  }
};

const addLike = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }
    next(err);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
