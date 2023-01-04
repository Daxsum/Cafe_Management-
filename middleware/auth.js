const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  const token = req.header("authorization");
  if (!token) return res.status(401).send("access denied! no token provided");
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("ïnvalid token!");
  }
}
module.exports = auth;
