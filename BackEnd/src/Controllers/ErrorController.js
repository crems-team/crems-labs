const AppError = require('../Utils/AppError');
const logger = require('../Config/logger');
const sendErrorMail = require('../Utils/sendErrorMail');

const handleDBError = err => {
  const message = `Database error. Code: ${err.code}. Message: ${err.originalError.message}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(
    `${err.statusCode} - ${err.message} - URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`,
    {
      stack: err.stack 
    }
  );

  let error = err;

  if (error.originalError) error = handleDBError(error);
  // ---- NOTIFICATION MAIL ----
  if (!error.isOperational || error.statusCode >= 500) {
    // sendErrorMail({
    //   subject: `[ALERT] Critical error - ${error.statusCode}`,
    //   html: `
    //     <h2>Critical error detected</h2>
    //     <p><b>Message:</b> ${error.message}</p>
    //     <p><b>URL:</b> ${req.originalUrl}</p>
    //     <p><b>Method:</b> ${req.method}</p>
    //     <p><b>IP:</b> ${req.ip}</p>
    //     <pre><b>Stack:</b>\n${error.stack}</pre>
    //   `
    // }).catch(e => logger.error('Mail error:', e));
  }
  // ------------------------------------------------------------------------

  const response = {
    status: error.status,
    message: error.isOperational ? error.message : "An unexpected error occurred.",
  };
//   if (process.env.NODE_ENV === 'development') {
//     response.stack = error.stack;
//   }

  res.status(error.statusCode).json(response);
};
