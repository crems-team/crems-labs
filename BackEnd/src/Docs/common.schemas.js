module.exports = {

    
    ErrorResponse: {
        type: 'object',
        properties: { status: { type: 'string', example: 'fail || error' },
                      message: { type: 'string', example: 'Not found' } 
      },
    }
};