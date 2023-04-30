const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this.id, role: this.role }, process.env.JWT);
  return token;
};
const Users = mongoose.model("Users", userSchema);

function validate(userData) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    userName: Joi.string().min(3).required(),
    email: Joi.string().min(3).email(),
    role: Joi.string().min(1).required(),
    password: Joi.string().min(3).required(),
  });
  return schema.validate(userData);
}
exports.validate = validate;
exports.Users = Users;
exports.userSchema = userSchema;
