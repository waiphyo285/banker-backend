const sql = require("./database/connection.js");
const md5 = require('md5');

// constructor
const User = function(user) {
  this.id = user.id;
  this.username = user.username;
  this.password = md5(user.password);
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO bank_users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // console.log(cardGen({starts_with: '171301'}))

    console.log("created: ", { id: res.id, ...newUser });
    result(null, { status: 200, message: "Successfully registered", data: { id: res.id, ...newUser }});
  });
};

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM bank_users WHERE id = '${userId}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found: ", res[0]);
      result(null, { status: 200, message: "Successfully retrieve", data: res[0] });
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.logIn = (username, password, result) => {
  sql.query(`SELECT * FROM bank_users WHERE username = '${username}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found: ", res[0]);

     (res[0].password == md5(password))
        ? result(null, { status: 200, message: "Successfully login", data: res[0] })
        : result(null, { status: 401, message: "Unsuccessful login", data: {} })
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM bank_users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
   
    result(null, { status: 200, message: "Successfully retrived", data: res});
  });
};

User.updateById = (id, user, result) => {

  sql.query(
    "UPDATE bank_users SET username = ?, password = ?, status = ?, remark = ? WHERE id = ?", [user.username, user.password, user.status, user.remark, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated: ", { id: res.id, ...user });
      result(null, { status: 200, message: "Successfully retrieved", data: { id: res.id, ...user } });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM bank_users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted with id: ", id);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM bank_users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows}`);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

module.exports = User;
