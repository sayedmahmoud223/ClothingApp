export interface IProductBody {
    productName: string;
    categoryId: string;
    subcategoryId: string;
    description: string;
    slug: string;
    costPrice: number;
    soldPrice: number;
    mainColor: string;
    discount: number
}


export interface IProductFile {
    mainImage: IImage[];
    smallImage: IImage[];

}


export interface IImage {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: any
    size: number
}

