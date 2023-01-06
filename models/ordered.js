const mongoose = require("mongoose");
const Joi = require("joi");
const { ProductSchema } = require("./products");
const Ordered = mongoose.model(
  "Orderes",
  new mongoose.Schema({
    item: { type: ProductSchema, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    who: {
      type: new mongoose.Schema({
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
          required: false,
        },
        role: {
          type: String,
          required: true,
        },
      }),
      required: true,
    },
  })
);
function validate(item) {
  //validation
  const schema = Joi.object({
    productId: Joi.string().required().min(2),
    quantity: Joi.number().required().min(1),
  });
  return schema.validate(item);
}
exports.validate = validate;
exports.Ordered = Ordered;
