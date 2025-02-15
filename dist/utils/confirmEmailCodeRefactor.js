"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventEmitter_1 = require("./eventEmitter");
const sendEmail_1 = require("./sendEmail");
const templeteEmail_1 = __importDefault(require("./templeteEmail"));
console.log("🔄 Email event listener is registered..."); // ✅ Add this log to check if file is loaded
eventEmitter_1.eventEmitter.on("confirmEmail", async ({ email, vCode }) => {
    const subject = "Confirm Email";
    const link = `http://localhost:3050/api/v1/auth/confirmEmail/${vCode}`;
    const html = (0, templeteEmail_1.default)(link);
    const info = await (0, sendEmail_1.sendEmail)({ to: email, subject, html });
    if (!info) {
        console.error(`❌ Email delivery failed for ${email}`);
    }
    else {
        console.log(`✅ Email sent to ${email}`);
    }
});
