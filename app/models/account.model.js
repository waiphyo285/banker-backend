const sql =  require("./database/connection.js");

// constructor
const Account = function(account) {
  this.id = account.id;
  this.customer_id = account.customer_id;
  this.account_type = account.account_type;
  this.account_number = account.account_number;
  this.deposit_amount = account.deposit_amount;
};


Account.create = (newAccount, result) => {
  sql.query("INSERT INTO bank_accounts SET ?", newAccount, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // console.log(cardGen({starts_with: '171301'}))

    console.log("created: ", { id: res.id, ...newAccount });
    result(null, { status: 200, message: "Successfully registered", data: { id: res.id, ...newAccount }});
  });
};

Account.findById = (accountId, result) => {
  sql.query(`SELECT * FROM bank_accounts WHERE id = '${accountId}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found: ", res[0]);
      result(null, { status: 200, message: "Successfully updated", data: res[0] });
      return;
    }

    // not found Account with the id
    result({ kind: "not_found" }, null);
  });
};

Account.getAll = result => {
  sql.query("SELECT * FROM bank_accounts", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("object: ", res);
    result(null, { status: 200, message: "Successfully retrived", data: res});
  });
};

Account.updateById = (id, account, result) => {

  sql.query(
    "UPDATE bank_accounts SET username = ?, password = ?, status = ?, remark = ? WHERE id = ?", [account.username, account.password, account.status, account.remark, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Account with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated: ", { id: res.id, ...account });
      result(null, { status: 200, message: "Successfully retrieved", data: { id: res.id, ...account } });
    }
  );
};

Account.remove = (id, result) => {
  sql.query("DELETE FROM bank_accounts WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Account with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted with id: ", id);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

Account.removeAll = result => {
  sql.query("DELETE FROM bank_accounts", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows}`);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

module.exports = Account;
