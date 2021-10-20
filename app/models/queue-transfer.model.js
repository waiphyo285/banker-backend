const sql =  require("./database/connection.js");
// const sql2 =  require("./database/connection2.js");

const mysql = require('mysql2/promise');
const dbConfig = require("../config/db.config.js");

const moment = require('moment');

// constructor
const QueueTransfer = {}

QueueTransfer.create = async () => {
  let sql2 = await mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });
  
  await sql2.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
  await sql2.beginTransaction();
    
  const NormalTransfers = await sql2.execute('SELECT * FROM bank_transfers WHERE transfer_type = ? AND transfer_complete = ?', ['normal', 0]);

    console.log(NormalTransfers[0]);
    
    if (NormalTransfers[0] && NormalTransfers[0].length > 0) {
        NormalTransfers[0].map(async (transObj, idx) => {
            try {
                const checkBalance = await sql2.execute('SELECT * FROM bank_accounts WHERE id = ?', [transObj.transfer_acc_id])

                if (checkBalance[0][0].deposit_amount >= transObj.transfer_amount) {

                    await sql2.execute(`UPDATE bank_transfers  SET transfer_complete= 1, updated_at = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}' WHERE id=?`,
                        [transObj.id]
                    );

                    await sql2.execute(`UPDATE bank_accounts SET deposit_amount=deposit_amount - ${transObj.transfer_amount} WHERE id = ?`,
                        [transObj.transfer_acc_id]
                    );
                
                    await sql2.execute(`UPDATE bank_accounts SET deposit_amount=deposit_amount + ${transObj.transfer_amount} WHERE id = ?`,
                        [transObj.receive_acc_id]
                    );

                    console.log("Successfully transferred");
                    
                }
                else {
                    console.log("Not enough to transfer money");
                }  

             } catch (err) {
                console.log("Batch update  err", err);
            }
                    
        });
    }
    await sql2.commit();
};


module.exports = QueueTransfer;