const _ = require("lodash");

const Joi = require("joi");

const bcrypt = require("bcrypt");
const express = require("express");
const { Users } = require("../models/users");
const router = express.Router();

router.post("/", async (req, res) => {
  const result = validate(req.body);
  if (result.error) {
    return res.status(404).send(result.error.details[0].message);
  }
  let user = await Users.findOne({ userName: req.body.userName });
  if (!user) return res.status(400).send("invalid username or password.");
  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("invalid username or password.");
  const token = user.generateAuthToken();
  res.send(token);
});
function validate(req) {
  const schema = Joi.object({
    userName: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
  });
  return schema.validate(req);
}
module.exports = router;
