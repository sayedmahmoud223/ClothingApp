import multer from "multer"
import { Request } from "express";
import { ResError } from "./errorHandling";

export const fileType = {
    imageTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"],
    pdf: ["application/pdf"]
}

export const fileUploud = (fileValidation: string[] | string = []) => {
    const storage = multer.memoryStorage();
   
    //filter method
    const fileFilter = (req: Request, file: any, cb: any): void => {
        if ((fileValidation as any).includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new ResError("invalid file format", 400), false); // Reject the file
        }
    };
    const upload = multer({ fileFilter, storage })
    return upload
}


