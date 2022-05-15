const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes/app');

const { PORT = 3000 } = process.env;

const app = express();

app.use(routes);
app.use((req, res, next) => {
  req.user = {
    _id: '6280e8d8f79346387adc173e',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT);
