import categoryModel from "../../../DB/models/catgeoryModel";
import { ApiFeature } from "../../../utils/apiFeatures";

class CategoryService {
    async readAll(reqParams: any) {
        const readAll = new ApiFeature(categoryModel.find({}), reqParams.query).paginate().filter().search().sort();
        const data = await readAll.mongooseQuery
        const allCount = await readAll.getAllCount(categoryModel)
        const allPages = Math.ceil(allCount / readAll.queryData.size)
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size, allPages }
    }
    async readOne() {

    }
}

export const categoryService: CategoryService = new CategoryService()