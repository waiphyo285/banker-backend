const sql =  require("./database/connection.js");
const md5 = require('md5');

// constructor
const Customer = function(customer) {
  this.id = customer.id;
  this.username = customer.username;
  this.password = md5(customer.password);
};

Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO bank_customers SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // console.log(cardGen({starts_with: '171301'}))

    console.log("created: ", { id: res.id, ...newCustomer });
    result(null, { status: 200, message: "Successfully registered", data: { id: res.id, ...newCustomer }});
  });
};

Customer.findById = (customerId, result) => {
  sql.query(`SELECT * FROM bank_customers WHERE id = '${customerId}'`, (err, res) => {
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

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getAll = result => {
  sql.query("SELECT * FROM bank_customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("object: ", res);
    result(null, { status: 200, message: "Successfully retrived", data: res});
  });
};

Customer.updateById = (id, customer, result) => {

  sql.query(
    "UPDATE bank_customers SET username = ?, password = ?, status = ?, remark = ? WHERE id = ?", [customer.username, customer.password, customer.status, customer.remark, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated: ", { id: res.id, ...customer });
      result(null, { status: 200, message: "Successfully retrieved", data: { id: res.id, ...customer } });
    }
  );
};

Customer.remove = (id, result) => {
  sql.query("DELETE FROM bank_customers WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted with id: ", id);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

Customer.removeAll = result => {
  sql.query("DELETE FROM bank_customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows}`);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

module.exports = Customer;
