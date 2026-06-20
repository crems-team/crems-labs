const AppError = require('./AppError');

/**
 * Executes an asynchronous operation (e.g. DB request) with retry attempts and a timeout.
 * @param {Function} asyncOperation - The async function to execute. Must return a Promise.
 * @param {object} options - Configuration options.
 * @param {number} options.retries - Number of attempts (e.g. 3).
 * @param {number} options.timeout - Timeout duration in milliseconds before considering the request failed (e.g. 15000).
 * @returns {Promise<any>} - The result of the operation.
 */
exports.executeWithRetry = async (asyncOperation, options = { retries: 3, timeout: 60000 }) => {
  for (let i = 0; i < options.retries; i++) {
    try {
      // Runs the request and a timer in parallel. Whichever finishes first wins.
      const result = await Promise.race([
        asyncOperation(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), options.timeout)
        ),
      ]);
      return result; // Succes, return result
    } catch (err) {
        console.warn(`Attempt ${i + 1} failed. Error: ${err.message}`);
        if (i === options.retries - 1) {
          // If it's the last attempt, throw a structured error
          const errorMessage = err.message === 'timeout' 
            ? `The request timed out after ${options.timeout / 1000}s and ${options.retries} attempts.`
            : `Request failed after ${options.retries} attempts.Error: ${err.message}`;
          throw new AppError(errorMessage, 503); // 503 Service Unavailable
        }
        // Wait a bit before retrying (optional)
        await new Promise(res => setTimeout(res, 500));
    }
  }
};