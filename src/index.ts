import express, { Request, Response } from "express";
import dotenv from "dotenv";
import "./utils/confirmEmailCodeRefactor"
// import "./modules/asAdmin/catogry/handleCategoryImage"
import { initApp } from "./initApp/initApp";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3050;

initApp(app, express)

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});