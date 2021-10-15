const { v4: uuidv4 } = require('uuid');
const Customer = require("../models/customer.model.js");

// Create and Save a new Customer
exports.create = (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  // Create a Customer
  const customer = new Customer({
    id: req.body.id || uuidv4(),
    username: req.body.username,
    password: req.body.password
  });

  // Save Customer in the database
  Customer.create(customer, (err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while creating."
      });
    // else res.send(data);
    else {
      req.body.customer_id = data.data.id;
      next()
    }
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while retrieving."
      });
    else res.send(data);
  });
};

// Find a single Customer with a customerId
exports.LogIn = (req, res) => {
  const { username, password } = req.body;

  Customer.logIn(username, password, (err, data) => {
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
    } else res.send(data);
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  Customer.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Error retrieving with id " + req.params.customerId
        });
      }
    } else res.send(data);
  });
};


// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  Customer.updateById(
    req.params.customerId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            status: 404,
            data: `Not found with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            status: 500,
            data: "Error updating with id " + req.params.customerId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found  with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Could not delete with id " + req.params.customerId
        });
      }
    } else res.send(data);
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while removing all."
      });
    else res.send(data);
  });
};
