const jwt = require("jsonwebtoken");

//VERIFY WEB TOKEN
const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(403).json("ユーザートークンが正しくありません。");
      else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json("承認されていないユーザーです。");
  }
};

module.exports = { verifyToken };
