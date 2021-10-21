var _jwt = require("../middleware/jwt");

module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const userroles = require("../controllers/userrole.controller.js");
  const customers = require("../controllers/customer.controller.js");
  const accounts = require("../controllers/account.controller.js");
  const transfers = require("../controllers/transfer.controller.js");

  app.get("/roles/all", _jwt.checkToken,userroles.all);
  app.get("/roles/user", _jwt.checkToken, userroles.user, users.findAll);
  app.get("/roles/customer", _jwt.checkToken, userroles.customer, customers.findAll);
  app.get("/roles/history", _jwt.checkToken, userroles.history, transfers.findAll);

  // Retrieve all Users
  app.get("/users/rtall", _jwt.checkToken, users.findAll);
  // Retrieve a single User with userId
  app.get("/users/:userId", _jwt.checkToken, users.findOne);
  // Update a User with userId
  app.put("/users/:userId", _jwt.checkToken, users.update);
  // Delete a User with userId
  app.delete("/users/:userId", _jwt.checkToken, users.delete);
  // Remove all Users
  app.delete("/users/rmall", _jwt.checkToken, users.deleteAll);

  // Create a new Customer
  app.post("/customers/create", _jwt.checkToken, customers.create, accounts.create);
  // Retrieve all Customers
  app.get("/customers/rtall", _jwt.checkToken, customers.findAll);
  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", _jwt.checkToken, customers.findOne);
  // Update a Customer with customerId
  app.put("/customers/:customerId", _jwt.checkToken, customers.update);
  // Delete a Customer with customerId
  app.delete("/customers/:customerId", _jwt.checkToken, customers.delete);
  // Remove all Customers
  app.delete("/customers/rmall", _jwt.checkToken, customers.deleteAll);

  // Create a new Account
  app.post("/accounts/create", _jwt.checkToken, accounts.create);
  // Retrieve all Accounts
  app.get("/accounts/rtall", _jwt.checkToken, accounts.findAll);
  // Retrieve a single Account with accountId
  app.get("/accounts/:accountId", _jwt.checkToken, accounts.findOne);
  // Update a Account with accountId
  app.put("/accounts/:accountId", _jwt.checkToken, accounts.update);
  // Delete a Account with accountId
  app.delete("/accounts/:accountId", _jwt.checkToken, accounts.delete);
  // Remove all Accounts
  app.delete("/accounts/rmall", _jwt.checkToken, accounts.deleteAll);

    // Create a new Transfer
  app.post("/transfers/create", _jwt.checkToken, transfers.create);
  // Retrieve all Transfer
  app.get("/transfers/rtall", _jwt.checkToken, transfers.findAll);
  // Retrieve a single Transfer with transferId
  app.get("/transfers/:accountId", _jwt.checkToken, transfers.findOne);
  // Update a Transfer with transferId
  app.put("/transfers/:accountId", _jwt.checkToken, transfers.update);
  // Delete a Transfer with transferId
  app.delete("/transfers/:accountId", _jwt.checkToken, transfers.delete);
  // Remove all Transfer
  app.delete("/transfers/rmall", _jwt.checkToken, transfers.deleteAll);
};
