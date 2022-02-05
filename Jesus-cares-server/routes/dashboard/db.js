// require("dotenv").config();
// const mysql = require("mysql2");
// const config = {
//   user: process.env.db_user,
//   password: process.env.db_password,
//   host: process.env.db_host,
//   database: process.env.db_database,
//   port: process.env.db_port,
// };
// const db = mysql.createConnection(config);

// db.connect((err) => {
//   if (err) throw err;
//   console.log("db connected");
// });
// // const handle = () => {
// //   sql = `create table projects (id int primary key auto_increment, name varchar(150), content varchar(300), date varchar(200))`;
// //   drop = `truncate table projects`;
// //   db.query(drop, (err, result) => {
// //     if (err) throw err;
// //     console.log(result);
// //   });
// // };
// // handle()
// module.exports = db;
