const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.listen(port, () => {
  console.log('app listening on port ' + port);
});
