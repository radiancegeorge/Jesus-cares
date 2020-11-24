require('dotenv').config()
const mysql = require('mysql');
const config = {
    user: process.env.db_user,
    password: process.env.db_password,
    host: process.env.db_host,
    database: process.env.db_database,
    port:process.env.db_port
}
const db = mysql.createConnection(config);




db.connect(err=>{
    if(err)throw err;
    console.log('db connected')
})

module.exports = db