class CustomError extends Error {
    constructor(message, status = 500, details = []) {
        super(message);
        this.name = 'CustomError';
        this.status = status;
        this.details = details;
        this.isCustom = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;
