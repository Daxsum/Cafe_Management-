const mongoose = require("mongoose");
const Joi = require("joi");
const typeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String },
});
const Type = mongoose.model("Types", typeSchema);
function validate(type) {
  //validation
  const schema = Joi.object({
    name: Joi.string().required().min(2),
  });
  return schema.validate(type);
}
exports.validate = validate;
exports.Types = Type;
exports.TypeSchema = typeSchema;
