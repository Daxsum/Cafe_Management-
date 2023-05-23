require("express-async-errors");////this package replace async module in medilware directory i use it for simplisity or you can you asyc module and wrap all the routes with async module exported function to make sure logging error working
const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const login = require("./routes/auth");
const error= require("./middleware/error")
const products = require("./routes/products");
const types = require("./routes/types");
const order = require("./routes/ordered");
const path = require("path");
let cors = require("cors");
/////connecting to database
mongoose
  .connect(
    "mongodb+srv://kalab:kalgoldenjet@axsumitequasar.zcbw5.mongodb.net/SemisterProject"
  )
  .then(() => {
    console.log("I'm connected to mongoDB ;-) ...");
  })
  .catch((err) => {
    console.log(":-( couldn't connect to mongoDb because of: ", err);
  });
const app = express();
app.use(cors());
app.use(express.json());

// app.use(express.static("public"));
app.use("/files/images", express.static("files/images"));
// app.use("/files/images", express.static("images"));
/////routes
app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/types", types);
app.use("/api/products", products);
app.use("/api/order", order);
app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`I'm listening at port ${port} ...`);
});
