const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 8080;

const mongouri = process.env.MONGOURI || "mongodb://localhost/nhlscraper";

//Connect to Mongo
mongoose
  .connect(
    mongouri,
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then(() => console.log("Connected to Mongo"))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Use Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));