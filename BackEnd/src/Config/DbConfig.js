const mssql = require("mssql");

const dbconfig = {
  server: "webcasting.database.windows.net",
  user: "report_user", 
  password: "@ccess190907",
  database: "TerradatumDB",
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
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection failed! Error:", err);
  });

module.exports = {
  pool,
  poolConnect,
  mssql,
};
