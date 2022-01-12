const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const postRoutes = require('./routes/post.routes.js');
const commentRoutes = require('./routes/comment.routes.js');

const app = express();

const port = process.env.PORT || 5000;

// cors
app.use(cors());

// database connection
mongoose.connect(process.env.DB_URI, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('database successfully connected!')
  }).catch((err) => {
    console.log(err);
  });

// static files
app.use(express.static('public'));
app.use(express.static(process.cwd() + '/src/tmp/uploads'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(port, () => {
  console.log('app listening on port ' + port);
});

// for testing purposes
module.exports = app;
