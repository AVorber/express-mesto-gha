const Card = require('../models/card');

const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.status(200).send(cards);
};

const createCard = async (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  const card = new Card({ name, link, owner });
  res.status(200).send(await card.save());
};

const deleteCardById = async (req, res) => {
  const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
  res.status(200).send(deletedCard);
};

const addLike = async (req, res) => {
  const updatedCardLike = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  );
  res.status(200).send(updatedCardLike);
};

const deleteLike = async (req, res) => {
  const updatedCardDislike = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  );
  res.status(200).send(updatedCardDislike);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
