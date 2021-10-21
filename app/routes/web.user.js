module.exports = app => {
  const users = require("../controllers/user.controller.js");
  // Create a new User
  app.post("/users/create", users.create);
  //  Login as User
  app.post("/users/login", users.LogIn);
};
