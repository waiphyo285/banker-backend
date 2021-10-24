const { v4: uuidv4 } = require('uuid');
const Transfer = require("../models/transfer.model.js");

// Create and Save a new Transfer
exports.create = (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  // Create a Transfer
  const transfer = new Transfer({
    id: req.body.id || uuidv4(),
    transfer_acc_id: req.body.transfer_acc_id,
    receive_acc_id: req.body.receive_acc_id,
    transfer_amount: req.body.transfer_amount,
    transfer_type: req.body.transfer_type,
    remark: req.body.remark,
    created_at: `${req.body.created_at}`,
    updated_at: `${req.body.updated_at}`
  });

  // Save Transfer in the database
  Transfer.create(transfer, (err, data) => {
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
  Transfer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while retrieving."
      });
    else res.send(data);
  });
};

// Find a single Transfer with a transferId
exports.findOne = (req, res) => {
  Transfer.findById(req.params.transferId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found with id ${req.params.transferId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Error retrieving with id " + req.params.transferId
        });
      }
    } else res.send(data);
  });
};


// Update a Transfer identified by the transferId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      status: 400,
      data: "Content can not be empty!"
    });
  }

  Transfer.updateById(
    req.params.transferId,
    new Transfer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            status: 404,
            data: `Not found with id ${req.params.transferId}.`
          });
        } else {
          res.status(500).send({
            status: 500,
            data: "Error updating with id " + req.params.transferId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Transfer with the specified transferId in the request
exports.delete = (req, res) => {
  Transfer.remove(req.params.transferId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: 404,
          data: `Not found  with id ${req.params.transferId}.`
        });
      } else {
        res.status(500).send({
          status: 500,
          data: "Could not delete with id " + req.params.transferId
        });
      }
    } else res.send(data);
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Transfer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        status: 500,
        data: err.message || "Some error occurred while removing all."
      });
    else res.send(data);
  });
};
