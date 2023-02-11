const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const admin = require("../middleware/admin");
const { validate, Users } = require("../models/users");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/getAll", [auth, admin], async (req, res) => {
  const usersList = await Users.find();
  res.send(usersList);
});
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

router.put("/Update/:id", [auth, admin], async (req, res) => {
  // validation
  const result = validate(req.body);
  if (result.error) {
    return res.status(404).send(result.error.details[0].message);
  }
  let updateData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  };
  const salt = await bcrypt.genSalt(10);
  updateData.password = await bcrypt.hash(updateData.password, salt);

  const user = await Users.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  // const genre = genresList.find((g) => g.id === parseInt(req.params.id));
  if (!user) {
    return res.status(400).send("user not found with provided id");
  }
  res.send(user);
});
//delete specfic genre api end-point
router.delete("/Delete/:id", [auth, admin], async (req, res) => {
  const user = await Users.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(400).send("user not found with provided id");
  }

  res.send(user);
});
module.exports = router;
