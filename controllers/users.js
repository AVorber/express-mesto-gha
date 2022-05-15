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

const updateUser = async (req, res) => {
  const { name, about } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).send(updatedUser);
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const updatedAvatar = await User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).send(updatedAvatar);
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
};
