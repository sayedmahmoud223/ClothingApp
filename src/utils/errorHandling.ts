import { Request, Response, NextFunction } from 'express';

// ResError.ts
export class ResError extends Error {
    public status: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;
    }
}

// asyncHandler.ts
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err) => {
            next(err);
        });
    };
};

//globalError
export const globalError = (err: ResError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected error occurred';
    // Customize the error response format
    return res.status(statusCode).json({
        success: false,  // Always false in case of an error
        message: message,
        stack: process.env.MOOD === 'DEV' ? err.stack : undefined  // Stack trace shown only in dev mode
    });
};
