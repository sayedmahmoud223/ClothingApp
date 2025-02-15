"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./utils/confirmEmailCodeRefactor");
const initApp_1 = require("./initApp/initApp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3050;
(0, initApp_1.initApp)(app, express_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
