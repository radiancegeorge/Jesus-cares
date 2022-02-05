const { db_user, db_name, db_password } = process.env;
module.exports = {
  development: {
    username: db_user,
    password: db_password,
    database: db_name,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    storage: "./sqlite.db",
    dialect: "sqlite",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
