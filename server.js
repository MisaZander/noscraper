const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const mongouri = process.env.MONGODB_URI || "mongodb://localhost/nhlscraper";

//Connect to Mongo

//Use Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
app.use("/", htmlRoutes);
app.use("/api", apiRoutes);

mongoose
  .connect(
    mongouri,
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  })
  .catch(err => console.log(err));
