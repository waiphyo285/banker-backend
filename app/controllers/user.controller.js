const { v4: uuidv4 } = require('uuid');
const User = require("../models/user.model.js");

// Create and Save a new User
exports.create = (req, res, next) => {
  console.log(req.body);

  // Validate request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    id: req.body.id || uuidv4(),
    username: req.body.username,
    password: req.body.password,
    created_at: `${req.body.created_at}`,
    updated_at: `${req.body.updated_at}`
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while creating."
      });
    else res.send(data);
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while retrieving."
      });
    else res.send(data);
  });
};

// Find a single User with a userId
exports.LogIn = (req, res) => {
  const { username, password } = req.body;

  User.logIn(username, password, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found with  ${username}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Error retrieving with " + username
        });
      }
    }
    else res.send(data);
  });
};

// Find a single User with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Error retrieving with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};


// Update a User identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.userId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            status: 404,
            data: `Not found with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            status: 500,
            data: "Error updating with id " + req.params.userId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found  with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Could not delete with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while removing all."
      });
    else res.send(data);
  });
};
