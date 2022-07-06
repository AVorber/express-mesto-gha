const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(new InternalServerError('На сервере произошла ошибка'));
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
      next(new BadRequestError('Переданы некорректные данныеds'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректный id карточки'));
      return;
    }
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
