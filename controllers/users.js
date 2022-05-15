const User = require('../models/user');

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
};

const getUserByID = async (req, res) => {
  const userById = await User.findById(req.params.userId);
  res.status(200).send(userById);
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  const user = new User({ name, about, avatar });
  res.status(200).send(await user.save());
};

module.exports = { getUsers, getUserByID, createUser };
