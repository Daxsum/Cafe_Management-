const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validate, Products } = require("../models/products");
const { Types } = require("../models/types");

//file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
//////////////////////////

router.get("/getAll", async (req, res) => {
  const productList = await Products.find().sort("name");
  res.send(productList);
});
/// get specfic genre api end-point
router.get("/:id", async (req, res) => {
  //validation of if the the id of that genre is exist or not
  const product = await Products.findById(req.params.id);

  if (!product) {
    return res.status(400).send("product not found with provided id");
  }
  //validation complite so sending the requested genre
  res.send(product);
});
// add new genre in to the array api end-point

router.post(
  "/Add",
  [auth, admin, upload.single("file")],
  async function (req, res) {
    const result = validate(req.body);
    if (result.error) {
      return res.status(404).send(result.error.details[0].message);
    }
    const type = await Types.findById(req.body.typeId);
    if (!type) return res.status(400).send("invalid type");

    const product = new Products({
      filePath: req.file.path,
      name: req.body.name,
      type: {
        name: type.name,
        id: type._id,
      },
      numberInStock: parseInt(req.body.numberInStock),
      price: parseInt(req.body.price),
    });
    await product.save();
    //send the genre back
    res.send(product);
    // res.send("done");
    console.log(req.file, req.body);
  }
);

router.put(
  "/Update/:id",
  [auth, admin, upload.single("file")],
  async (req, res) => {
    // validation
    const result = validate(req.body);
    if (result.error) {
      return res.status(404).send(result.error.details[0].message);
    }
    const type = await Types.findById(req.body.typeId);
    if (!type) return res.status(400).send("invalid type");
    const product = await Products.findByIdAndUpdate(
      req.params.id,
      {
        filePath: req.file.path,
        name: req.body.name,
        type: {
          name: type.name,
          id: type.id,
        },
        numberInStock: req.body.numberInStock,
        price: req.body.price,
      },
      { new: true }
    );
    // const genre = genresList.find((g) => g.id === parseInt(req.params.id));
    if (!product) {
      return res.status(400).send("product not found with provided id");
    }
    res.send(product);
  }
);
//deleteing specfic genre api end-point
router.delete("/Delete/:id", [auth, admin], async (req, res) => {
  const product = await Products.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(400).send("product not found with provided id");
  }

  res.send(product);
});
module.exports = router;
