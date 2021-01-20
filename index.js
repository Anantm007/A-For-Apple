const express = require("express");
const app = express();

// Utilities
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Config variables
require("dotenv").config();
const {MONGOURI} = process.env;

// Setting the EJS engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// To get data in JSON format
app.use(bodyParser.urlencoded({extended: true}));

// Connecting to the database
mongoose.promise = global.Promise;
console.log(MONGOURI);
mongoose.connect(
  MONGOURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  (err, db) => {
    if (err) console.log(err);
    else console.log("Database Connected...");
  }
);

// Test route
app.get("/api", async (req, res) => {
  return res.status(200).json({message: "API running..."});
});

// Mounting the routes
app.use("/", require("./routes/index"));

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
