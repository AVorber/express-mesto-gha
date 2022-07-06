const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes/app');
const { SERVER_ERROR } = require('./errors/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'На сервере произошла ошибка' : message });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT);
