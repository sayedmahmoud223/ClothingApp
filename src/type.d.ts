export interface tokenPayload {
    _id: string;
    email: string;
    userName:string;
    role: string;
}

declare global {
    namespace Express {
        export interface Request {
            decoded?: tokenPayload;
        }
    }
}