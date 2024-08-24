const mssql = require("mssql");
require('dotenv').config()

/*
const dbconfig = {
  
  server: "webcasting.database.windows.net",
  user: "report_user",
  password: "@ccess190907",
  database: "TerradatumDB",
  trustServerCertificate: true

}

*/

const server = process.env.APP_DB_SERVER;
const user = process.env.APP_DB_USER;
const pwd = process.env.APP_DB_PWD;
const db = process.env.APP_DB_NAME;

const dbconfig = {
  
  server: `${server}`,
  user: `${user}`,
  password: `${pwd}`,
  database: `${db}`,
  trustServerCertificate: true

}


const pool = new mssql.ConnectionPool(dbconfig);
const poolConnect = pool.connect();

module.exports = {
  pool,
  poolConnect,
  mssql
};
