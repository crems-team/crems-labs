// This function takes an async function and returns a new function
// that executes the original one and catches any error to pass it to next().

module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };