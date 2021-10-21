const sql =  require("./database/connection.js");
// const sql2 =  require("./database/connection2.js");

const mysql = require('mysql2/promise');
const dbConfig = require("../config/db.config.js");

const md5 = require('md5');

// constructor
const Transfer = function(transfer) {
    this.id = transfer.id,
    this.transfer_acc_id = transfer.transfer_acc_id,
    this.receive_acc_id = transfer.receive_acc_id,
    this.transfer_amount = transfer.transfer_amount,
    this.transfer_type = transfer.transfer_type,
    this.remark = transfer.remark
};

Transfer.create = async (newTransfer, result) => {
  let sql2 = await mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

  let transfer_complete = 0, transfer_charge = 0, batch_amount = 0;
  
  await sql2.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
  await sql2.beginTransaction();

  try {
    const checkBalance = await sql2.execute(
      'SELECT * FROM bank_accounts WHERE id = ?', [newTransfer.transfer_acc_id]
    )

    const batchBalance = await sql2.execute(
      'SELECT SUM(transfer_amount) as total_batch FROM bank_transfers WHERE transfer_complete = ? AND transfer_acc_id = ? GROUP BY transfer_acc_id', [0, newTransfer.transfer_acc_id]
    );

    batch_amount = (batchBalance[0][0]) ? parseInt(batchBalance[0][0].total_batch) : 0;

    if (parseInt(checkBalance[0][0].deposit_amount) >= (parseInt(newTransfer.transfer_amount) + batch_amount)) {

      if (newTransfer.transfer_type === "fast") {
        transfer_complete = 1;
        transfer_charge = newTransfer.transfer_amount * 5 / 100;
        newTransfer.transfer_amount = newTransfer.transfer_amount - transfer_charge;
      }

      await sql2.execute(
        'INSERT INTO bank_transfers (id, transfer_acc_id, receive_acc_id, transfer_type, transfer_amount, transfer_charge, transfer_complete, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [newTransfer.id, newTransfer.transfer_acc_id, newTransfer.receive_acc_id, newTransfer.transfer_type, newTransfer.transfer_amount, transfer_charge, transfer_complete, newTransfer.remark]
      )

      if (transfer_complete) {
        await sql2.execute(
          `UPDATE bank_accounts SET deposit_amount=deposit_amount - ${newTransfer.transfer_amount} WHERE id = ?`,
          [newTransfer.transfer_acc_id]
        );
    
        await sql2.execute(
          `UPDATE bank_accounts SET deposit_amount=deposit_amount + ${newTransfer.transfer_amount} WHERE id = ?`,
          [newTransfer.receive_acc_id]
        );
      }
      console.log("completed: ", newTransfer);
    
      result(null, { status: 200, message: "Successfully transferred", data: { ...newTransfer }});
    }
    else {
      console.log("incompleted: Not enough to transfer money");
      result({ message: "Not enough to transfer money" }, null);
    }

    await sql2.commit();
  }
  catch (err) {
    console.log("error: ", err);
    sql2.rollback();
    result(err, null);
  }
};

Transfer.findById = (transferId, result) => {
  sql.query(`SELECT bank_transfers.* FROM bank_transfers WHERE bank_transfers.id = '${transferId}'`, (err, res) => {
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

    // not found Transfer with the id
    result({ kind: "not_found" }, null);
  });
};

Transfer.getAll = result => {
  sql.query(`SELECT t.*, t1.account_number as  transfer_acc, t2.account_number as receive_acc
            FROM bank_transfers t
            JOIN bank_accounts t1 ON t1.id = t.transfer_acc_id
            JOIN bank_accounts t2 ON t2.id = t.receive_acc_id
            ORDER BY updated_at DESC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
   
    result(null, { status: 200, message: "Successfully retrived", data: res});
  });
};

Transfer.updateById = (id, transfer, result) => {

  sql.query(
    "UPDATE bank_transfers SET transfer_acc_id = ?, receive_acc_id = ?, transfer_amount = ?, transfer_type =  ?, remark = ? WHERE id = ?", [transfer.transfer_acc_id, transfer.receive_acc_id, transfer.transfer_amount, transfer.transfer_type, transfer.remark, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Transfer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated: ", { id: res.id, ...transfer });
      result(null, { status: 200, message: "Successfully retrieved", data: { id: res.id, ...transfer } });
    }
  );
};

Transfer.remove = (id, result) => {
  sql.query("DELETE FROM bank_transfers WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Transfer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted with id: ", id);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

Transfer.removeAll = result => {
  sql.query("DELETE FROM bank_transfers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows}`);
    result(null, { status: 200, message: "Successfully deleted", data: res });
  });
};

module.exports = Transfer;