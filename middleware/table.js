function table(req, res, next) {
  if (req.user.role !== "table") return res.status(403).send("access denied!");
  next();
}
module.exports = table;
