const mongoose = require('mongoose');
const { isURL } = require('../helpers/regex');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
