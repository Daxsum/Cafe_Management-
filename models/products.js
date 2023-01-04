const mongoose = require("mongoose");
const Joi = require("joi");
const { TypeSchema } = require("./types");
const Product = mongoose.model(
  "Products",
  new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: TypeSchema, required: true },
    numberInStock: { type: Number, required: true },
    price: { type: Number, required: true },
  })
);
function validate(item) {
  //validation
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    typeId: Joi.string().required().min(2),
    numberInStock: Joi.number().required().min(1),
    price: Joi.number().required().min(1),
  });
  return schema.validate(item);
}
exports.validate = validate;
exports.Products = Product;
