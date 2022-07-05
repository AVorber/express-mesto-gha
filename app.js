const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes/app');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.post('/signin', express.json(), login);
app.post('/signup', express.json(), createUser);

app.use(auth);
app.use(routes);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT);
