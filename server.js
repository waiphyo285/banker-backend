const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const schedule = require('node-schedule');
const bodyParser = require("body-parser");
const Transfer = require("./app/models/transfer.model");
const QueueTransfer = require("./app/models/queue-transfer.model");

let interval;
const app = express();

app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  next();
});

// simple route
app.get("/", (req, res) => { res.json({ message: "Welcome to banker application." }); });

require("./app/routes/web.routes.js")(app);

// // set port, listen for requests
const PORT = process.env.PORT || 7070;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:7700",
    }
});


io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  // Emitting a new message. Will be consumed by the client
  Transfer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while retrieving."
      });
    // else res.send(data);
    else socket.emit("FromAPI", data);
  });
  
};

const job = schedule.scheduleJob('0 0 * * *', function () {
  QueueTransfer.create((err, data) => {
    if (err)
      console.log(err)
    else  console.log(data);
  });
  console.log("Batch transfer at every midnight.");
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

