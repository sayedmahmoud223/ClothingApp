"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    // console.log(process.env.DB_ONLINE_URL);
    // console.log(process.env.DB_OFFLINE_URL);
    const { DB_ONLINE_URL, DB_OFFLINE_URL, MOOD } = process.env;
    return await mongoose_1.default.connect(`${MOOD == "DEV" ? DB_OFFLINE_URL : DB_ONLINE_URL}`)
        .then(res => console.log(`DB Connected successfully on ${MOOD == "DEV" ? DB_OFFLINE_URL : DB_ONLINE_URL}`))
        .catch(err => console.log(` Fail to connect  DB.........${err} `));
};
exports.default = connectDB;
