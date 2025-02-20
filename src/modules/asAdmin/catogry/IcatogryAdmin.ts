import { Types } from "mongoose";

export interface ICreateCategory {
    name: string;
    image: Record<string, any>;
    customId:string;
}

export interface IUpdateCategory {
    name: string;
    image: Record<string, any>;
    categoryId: string
}

export interface IDeleteCategory {
    name: string;
    image: Record<string, any>;
}