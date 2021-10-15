module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const customers = require("../controllers/customer.controller.js");
  const accounts = require("../controllers/account.controller.js");

    // Create a new User
  app.post("/users/create", users.create);
  // Retrieve all Users
  app.get("/users/rtall", users.findAll);
  // Retrieve a single User with userId
  app.get("/users/:userId", users.findOne);
  //  Login as User
  app.post("/users/login", users.LogIn);
  // Update a User with userId
  app.put("/users/:userId", users.update);
  // Delete a User with userId
  app.delete("/users/:userId", users.delete);
  // Remove all Users
  app.delete("/users/rmall", users.deleteAll);

  // Create a new Customer
  app.post("/customers/create", customers.create, accounts.create);
  // Retrieve all Customers
  app.get("/customers/rtall", customers.findAll);
  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", customers.findOne);
  // Update a Customer with customerId
  app.put("/customers/:customerId", customers.update);
  // Delete a Customer with customerId
  app.delete("/customers/:customerId", customers.delete);
  // Remove all Customers
  app.delete("/customers/rmall", customers.deleteAll);

  // Create a new Account
  app.post("/accounts/create", accounts.create);
  // Retrieve all Accounts
  app.get("/accounts/rtall", accounts.findAll);
  // Retrieve a single Account with accountId
  app.get("/accounts/:accountId", accounts.findOne);
  // Update a Account with accountId
  app.put("/accounts/:accountId", accounts.update);
  // Delete a Account with accountId
  app.delete("/accounts/:accountId", accounts.delete);
  // Remove all Accounts
  app.delete("/accounts/rmall", accounts.deleteAll);
};
