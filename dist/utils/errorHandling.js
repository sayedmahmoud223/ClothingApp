"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = exports.asyncHandler = exports.ResError = void 0;
// ResError.ts
class ResError extends Error {
    status;
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}
exports.ResError = ResError;
// asyncHandler.ts
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err);
        });
    };
};
exports.asyncHandler = asyncHandler;
//globalError
const globalError = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected error occurred';
    // Customize the error response format
    return res.status(statusCode).json({
        success: false, // Always false in case of an error
        message: message,
        stack: process.env.MOOD === 'DEV' ? err.stack : undefined // Stack trace shown only in dev mode
    });
};
exports.globalError = globalError;
