const mongoose = require("mongoose");
const Joi = require("joi");
const { TypeSchema } = require("./types");
const ProductSchema = new mongoose.Schema({
  filePath: { type: String },
  name: { type: String, required: true },
  type: { type: TypeSchema },
  numberInStock: { type: Number, required: true },
  price: { type: Number, required: true },
});
const Product = mongoose.model("Products", ProductSchema);
function validate(item) {
  //validation
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    typeId: Joi.string(),
    numberInStock: Joi.number().required().min(1),
    price: Joi.number().required().min(1),
  });
  return schema.validate(item);
}
exports.validate = validate;
exports.Products = Product;
exports.ProductSchema = ProductSchema;
