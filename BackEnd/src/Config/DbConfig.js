const mssql = require("mssql");

const server = process.env.APP_DB_SERVER;
const user = process.env.APP_DB_USER;
const pwd = process.env.APP_DB_PWD;
const db = process.env.APP_DB_NAME;

const dbconfig = {
  
  server: `${server}`,
  user: `${user}`,
  password: `${pwd}`,
  database: `${db}`,
  trustServerCertificate: true,

  options: {
    encrypt: true,
    enableArithAbort: true, 
  },
  pool: {
    //max: 10, // Maximum number of connections in the pool
    //min: 0, // Minimum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
  connectionTimeout: 30000, // 30 seconds connection timeout
  requestTimeout: 30000, // 30 seconds request timeout
};

const pool = new mssql.ConnectionPool(dbconfig);
const poolConnect = pool.connect()
  .then(() => {
    console.log("Connected to the database ["+server+"]");
  })
  .catch((err) => {
    console.error("Database connection failed! Error:", err);
  });

module.exports = {
  pool,
  poolConnect,
  mssql,
};
