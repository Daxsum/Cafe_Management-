const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const { validate, Users } = require("../models/users");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await Users.findById(req.user.id).select("-password");
  res.send(user);
});
router.post("/signUp", async (req, res) => {
  const result = validate(req.body);
  if (result.error) {
    return res.status(404).send(result.error.details[0].message);
  }
  let user = await Users.findOne({ userName: req.body.userName });
  if (user)
    return res.status(400).send("user with this userName is already exists.");
  const UserRegister = new Users(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "userName",
      "password",
      "role",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  UserRegister.password = await bcrypt.hash(UserRegister.password, salt);
  await UserRegister.save();
  res.send(
    _.pick(UserRegister, [
      "id",
      "firstName",
      "lastName",
      "email",
      "userName",
      "role",
    ])
  );
});
module.exports = router;
