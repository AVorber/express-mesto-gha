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
  const cardById = await Card.findById(req.params.cardId);
  res.status(200).send(await cardById.deleteOne());
};

module.exports = { getCards, createCard, deleteCardById };
