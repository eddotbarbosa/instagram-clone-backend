const jwt = require('jsonwebtoken');

exports.authentication = async function (req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.json({result: 'token not provided!'});

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = verifyToken;

    next();
  } catch (err) {
    res.json({error: err});
  }
};

