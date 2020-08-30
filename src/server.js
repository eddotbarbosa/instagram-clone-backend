const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/user.routes.js');
const authRoutes = require('./routes/auth.routes.js');

const app = express();

const port = process.env.PORT || 5000;

// database connection
mongoose.connect(process.env.DB_URI, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('database successfully connected!')
  }).catch((err) => {
    console.log(err);
  });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log('app listening on port ' + port);
});

// for testing purposes
module.exports = app;
