const { z } = require('zod');

/**
 * Formats Zod errors into a simple { field: message } object.
 * @param {z.ZodError['issues']} issues - The array of Zod error issues.
 * @returns {Record<string, string>}
 */
const formatZodErrors = (issues) => {
  const errors = {};
  issues.forEach(issue => {
    // The 'path' is an array, e.g., ['user', 'name']. We join it to create a key.
    const path = issue.path.join('.'); 
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return errors;
};

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: formatZodErrors(error.issues), 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = validate;