"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodsWillUsed = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const errorHandling_1 = require("./errorHandling");
dotenv.config({ path: path_1.default.join(__dirname, '../../.env') });
class MethodsWillUsed {
    // Method to hash a plaintext value
    hash = ({ plaintext, salt = process.env.SALT_ROUND }) => {
        const hashResult = bcrypt_1.default.hashSync(plaintext, parseInt(salt || '10')); // default to 10 if undefined
        return hashResult;
    };
    // Method to compare a plaintext value with a hash
    compare = ({ plaintext, hashValue }) => {
        if (!hashValue) {
            throw new errorHandling_1.ResError("hashValue is requierd", 400);
        }
        console.log(process.env.SALT_ROUND);
        const match = bcrypt_1.default.compareSync(plaintext, hashValue);
        return match;
    };
    // Method to generate a JWT token
    generateToken = ({ payload = {}, signature = process.env.TOKEN_SIGNATURE, expiresIn = '3d' }) => {
        // Ensure signature is defined
        if (!signature) {
            throw new Error("Signature (TOKEN_SIGNATURE) is missing.");
        }
        // console.log({signature});
        // console.log({expiresIn});
        const token = jsonwebtoken_1.default.sign(payload, signature, { expiresIn });
        return token;
    };
    // Method to verify a JWT token
    verifyToken = ({ token, signature = process.env.TOKEN_SIGNATURE }) => {
        console.log({ signature });
        if (!signature) {
            throw new Error("Signature (TOKEN_SIGNATURE) is missing.");
        }
        const decoded = jsonwebtoken_1.default.verify(token, signature);
        console.log({ decoded });
        return decoded;
    };
}
exports.methodsWillUsed = new MethodsWillUsed();
