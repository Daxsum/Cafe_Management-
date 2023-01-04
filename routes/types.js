const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Types, validate } = require("../models/types");
//// get all the genres api end-point
router.get("/getAll", async (req, res) => {
  const typeList = await Types.find().sort("name");
  res.send(typeList);
});
/// get specfic genre api end-point
router.get("/:id", async (req, res) => {
  //validation of if the the id of that genre is exist or not
  const type = await Types.findById(req.params.id);

  if (!type) {
    return res.status(400).send("type not found with provided id");
  }
  //validation complite so sending the requested genre
  res.send(type);
});
// add new genre in to the array api end-point
router.post("/Add", [auth, admin], async (req, res) => {
  //validation
  const result = validate(req.body);
  if (result.error) {
    return res.status(404).send(result.error.details[0].message);
  }
  //add the genre in to the mongo

  const type = new Types({
    name: req.body.name,
  });
  await type.save();
  //send the genre back
  res.send(type);
});
// updating specfic genre
router.put("/Update/:id", [auth, admin], async (req, res) => {
  // validation
  const result = validate(req.body);
  if (result.error) {
    return res.status(404).send(result.error.details[0].message);
  }
  const type = await Types.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  // const genre = genresList.find((g) => g.id === parseInt(req.params.id));
  if (!type) {
    return res.status(400).send("type not found with provided id");
  }
  res.send(type);
});
//delete specfic genre api end-point
router.delete("/Delete/:id", [auth, admin], async (req, res) => {
  const type = await Types.findByIdAndDelete(req.params.id);

  if (!type) {
    return res.status(400).send("type not found with provided id");
  }

  res.send(type);
});
module.exports = router;
