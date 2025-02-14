import { NextFunction, Request, Response } from "express"
import { globalError } from "../utils/errorHandling"
import connectDB from "../DB/dbConnection"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "../modules/asUser/auth/authRouter"
import adminRouter from "../modules/asAdmin/adminRouter"
export const initApp = (app: any, express: any) => {
    connectDB()
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))
    app.use(cookieParser())
    app.use(express.json())
    app.use(`/api/v1/auth`, authRouter)
    app.use(`/api/v1/admin`, adminRouter)
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
        res.send("In-valid Routing Plz check url or method ")
    })
    app.use(globalError)
}