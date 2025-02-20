"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = exports.BaseUrl = void 0;
const errorHandling_1 = require("../utils/errorHandling");
const dbConnection_1 = __importDefault(require("../DB/dbConnection"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRouter_1 = __importDefault(require("../modules/asUser/auth/authRouter"));
const googleAuthRouter_1 = __importDefault(require("../modules/asUser/authGoogle/googleAuthRouter"));
const adminRouter_1 = __importDefault(require("../modules/asAdmin/adminRouter"));
exports.BaseUrl = process.env.ONLINE_BASE_URL;
const initApp = async (app, express) => {
    await (0, dbConnection_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(express.json());
    app.use(`/api/v1/auth`, authRouter_1.default, googleAuthRouter_1.default);
    app.use(`/api/v1/admin`, adminRouter_1.default);
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url or method ");
    });
    app.use(errorHandling_1.globalError);
};
exports.initApp = initApp;
