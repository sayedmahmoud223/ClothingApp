import { Types } from "mongoose";

// export interface ICreateSubcategory {
//     name: string;
//     categoryName:string;
//     image: Record<string, any>;
// }

export interface IUpdateSubCategory {
    name: string;
    image: Record<string, any>;
    SubcategoryId: string
}

export interface IDeleteSubcategory {
    name: string;
    image: Record<string, any>;
}