import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import * as dotenv from 'dotenv';
import { ResError } from './errorHandling';
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define types for method parameters
interface HashParams {
    plaintext: string;
    salt?: string;
}

interface CompareParams {
    plaintext: string;
    hashValue: string;
}

interface GenerateTokenParams {
    payload?: object;
    signature?: string;
    expiresIn?: any;
}

interface VerifyTokenParams {
    token: string;
    signature?: string;
}

class MethodsWillUsed {
    // Method to hash a plaintext value
    hash = ({ plaintext, salt = process.env.SALT_ROUND }: HashParams): string => {
        const hashResult = bcrypt.hashSync(plaintext, parseInt(salt || '10')); // default to 10 if undefined
        return hashResult;
    };

    // Method to compare a plaintext value with a hash
    compare = ({ plaintext, hashValue }: CompareParams): boolean => {
        console.log({hashValue});
        
        if (!hashValue) {
            throw new ResError("hashValue is requierd", 400)
        }
        console.log(process.env.SALT_ROUND);
        const match = bcrypt.compareSync(plaintext, hashValue);
        return match;
    };

    // Method to generate a JWT token
    generateToken = ({ payload = {}, signature = process.env.TOKEN_SIGNATURE, expiresIn = '3d' }: GenerateTokenParams) => {

        // Ensure signature is defined
        if (!signature) {
            throw new Error("Signature (TOKEN_SIGNATURE) is missing.");
        }
        // console.log({signature});
        // console.log({expiresIn});
        const token = jwt.sign(payload, signature, {expiresIn});
        return token;
    };
    
    // Method to verify a JWT token
    verifyToken = ({ token, signature = process.env.TOKEN_SIGNATURE }: VerifyTokenParams) => {
        console.log({signature});
        if (!signature) {
            throw new Error("Signature (TOKEN_SIGNATURE) is missing.");
        }
        const decoded = jwt.verify(token, signature);
        console.log({decoded});
        
        return decoded;
    };
}

export const methodsWillUsed = new MethodsWillUsed();
