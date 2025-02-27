import { NextFunction, Request, Response } from "express"
import { globalError } from "../utils/errorHandling"
import connectDB from "../DB/dbConnection"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "../modules/asUser/auth/authRouter"
import googleAuthRouter from "../modules/asUser/authGoogle/googleAuthRouter"
import adminRouter from "../modules/asAdmin/adminRouter"
export const BaseUrl = process.env.ONLINE_BASE_URL
export const initApp = async (app: any, express: any) => {
    await connectDB()
    app.use(cors({
        origin: ["http://localhost:4200", "https://dashboard-gules-seven.vercel.app"],
        credentials: true
    }))
    app.use(cookieParser())
    app.use(express.json())
    app.use(`/api/v1/auth`, authRouter, googleAuthRouter)
    app.use(`/api/v1/admin`, adminRouter)
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
        res.send("In-valid Routing Plz check url or method ")
    })
    app.use(globalError)
}