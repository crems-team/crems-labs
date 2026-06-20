module.exports = {

    Unauthorized: {
        description: 'Unauthorized (missing/invalid JWT)',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                    jwt: { value: { message: 'Unauthorized' } }
                }
            }
        }
    },
    Forbidden: {
        description: 'Access denied',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                    role: { value: { message: 'Access denied' } }
                }
            }
        }
    },
    NotFound: {
        description: 'Resource not found',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                    missing: { value: { status: "fail",
                                        message: 'No data found' } }
                }
            }
        }
    },
    InternalError: {
        description: 'Internal server error',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                    oops: { value: {status: "error", 
                                    message: 'Internal server error' } }
                }
            }
        }
    }
};