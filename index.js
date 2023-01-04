const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const login = require("./routes/auth");
const products = require("./routes/products");
const types = require("./routes/types");
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
app.use(express.json());
/////routes
app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/types", types);
app.use("/api/products", products);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`I'm listening at port ${port} ...`);
});
