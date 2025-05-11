// errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log the error (optional: use a logging service)
    console.error(err);

    // Check if the error is a custom error with an HTTP status
    if (err.isCustom) {
        return res.status(err.status || 500).json({
            message: err.message,
            details: err.details || []
        });
    }


    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            errors: err.errors
        });
    }

    // Handle other specific errors (e.g., 404, unauthorized)
    if (err.status) {
        return res.status(err.status).json({
            message: err.message || 'Error occurred'
        });
    }

    // Handle generic unexpected errors
    return res.status(500).json({
        message: 'Internal server error',
        error: err.message || 'An unexpected error occurred'
    });
};

module.exports = errorHandler;
