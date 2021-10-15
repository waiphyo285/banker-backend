const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to banker application." });
});

require("./app/routes/web.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
