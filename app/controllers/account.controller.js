const { v4: uuidv4 } = require('uuid');
const cardGen = require('card-number-generator')
const Account = require("../models/account.model.js");

// Create and Save a new Account
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  // Create a Account
  const account = new Account({
    id: req.body.id || uuidv4(),
    customer_id: req.body.customer_id,
    account_type: req.body.account_type || "current",
    account_number: req.body.account_number || cardGen({ starts_with: '171301' }),
    deposit_amount: req.body.deposit_amount || 100,
    created_at: `${req.body.created_at}`,
    updated_at: `${req.body.updated_at}`,
  });

  // Save Account in the database
  Account.create(account, (err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data:  err.message || "Some error occurred while creating."
      });
    else res.send(data);
  });
};

// Retrieve all Accounts from the database.
exports.findAll = (req, res) => {
  Account.getAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while retrieving."
      });
    else res.send(data);
  });
};

// Find a single Account with a AccountId
exports.findOne = (req, res) => {
  Account.findById(req.params.accountId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found with id ${req.params.accountId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Error retrieving with id " + req.params.accountId
        });
      }
    } else res.send(data);
  });
};

// Find a single Account with a AccountId
exports.findOne = (req, res) => {
  Account.findById(req.params.accountId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found with id ${req.params.accountId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Error retrieving with id " + req.params.accountId
        });
      }
    } else res.send(data);
  });
};

// Update a Account identified by the AccountId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  Account.updateById(
    req.params.accountId,
    new Account(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            status: 404,
            data: `Not found with id ${req.params.accountId}.`
          });
        } else {
          res.status(500).send({
            status: 500,
            data: "Error updating with id " + req.params.accountId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Account with the specified AccountId in the request
exports.delete = (req, res) => {
  Account.remove(req.params.AacountId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found  with id ${req.params.accountId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Could not delete with id " + req.params.accountId
        });
      }
    } else res.send(data);
  });
};

// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
  Account.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while removing all."
      });
    else res.send(data);
  });
};
