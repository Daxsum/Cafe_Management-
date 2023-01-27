const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const table = require("../middleware/table");
const { validate, Ordered } = require("../models/ordered");
const { Products } = require("../models/products");
const { Users } = require("../models/users");

router.get("/getAll", auth, async (req, res) => {
  const orderedLiist = await Ordered.find().sort("date");
  res.send(orderedLiist);
});
/// get specfic genre api end-point
router.get("/:id", async (req, res) => {
  //validation of if the the id of that genre is exist or not
  const order = await Ordered.findById(req.params.id);

  if (!order) {
    return res.status(400).send("order not found with provided id");
  }
  //validation complite so sending the requested genre
  res.send(order);
});
// add new genre in to the array api end-point

router.post("/Add", [auth, table], async (req, res) => {
  //validation
  const result = validate(req.body);
  if (result.error) {
    return res.status(404).send(result.error.details[0].message);
  }
  console.log("validation working");
  //add the genre in to the mongo
  const product = await Products.findById(req.body.productId);
  if (!product) return res.status(400).send("invalid product");
  if (product.numberInStock === 0)
    return res.status(400).send("item is not avalable");
  console.log("product validation working");
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(400).send("invalid user");
  console.log("user and product finding done ");

  const order = new Ordered({
    item: {
      _id: product._id,
      filePath: product.filePath,
      name: product.name,
      type: {
        name: product.type.name,
        id: product.type._id,
      },
      numberInStock: product.numberInStock,
      price: product.price,
    },
    quantity: req.body.quantity,
    who: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  });
  console.log("saving only neded ");
  await order.save();
  product.numberInStock = product.numberInStock - req.body.quantity;
  await product.save();
  console.log("Alldone ");
  //send the genre back
  res.send(order);
});
// updating specfic genre
router.put("/Update/:id", auth, async (req, res) => {
  // validation
  // const result = validate(req.body);
  // if (result.error) {
  //   return res.status(404).send(result.error.details[0].message);
  // }
  const product = await Products.findById(req.body.productId);
  if (!product) return res.status(400).send("invalid product");
  if (product.numberInStock === 0)
    return res.status(400).send("item is not avalable");
  console.log("product validation working");
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(400).send("invalid user");
  console.log("user and product finding done ");

  const order = await Ordered.findByIdAndUpdate(
    req.params.id,
    {
      // item: {
      //   filePath: product.filePath,
      //   name: product.name,
      //   type: {
      //     name: product.type.name,
      //     id: product.type._id,
      //   },
      //   numberInStock: product.numberInStock,
      //   price: product.price,
      // },
      // quantity: req.body.quantity,
      // who: {
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   userName: user.userName,
      //   email: user.email,
      //   role: user.role,
      // },
      isActive: req.body.isActive,
      Time: req.body.Time,
    },
    { new: true }
  );
  // const genre = genresList.find((g) => g.id === parseInt(req.params.id));
  if (!order) {
    return res.status(400).send("order not found with provided id");
  }
  res.send(order);
});
//deleteing specfic genre api end-point
// router.delete("/Delete/:id", [auth, admin], async (req, res) => {
//   const product = await Products.findByIdAndDelete(req.params.id);

//   if (!product) {
//     return res.status(400).send("product not found with provided id");
//   }

//   res.send(product);
// });
module.exports = router;
