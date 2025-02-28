import categoryModel from "../../../DB/models/catgeoryModel";
import { ApiFeature } from "../../../utils/apiFeatures";

class CategoryService {
    async readAll(reqParams: any) {
        const readAll = new ApiFeature(categoryModel.find({}), reqParams.query).paginate().filter().search().sort();
        const data = await readAll.mongooseQuery
        const allCount = await categoryModel.countDocuments()
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size }
    }
    async readOne() {

    }
}

export const categoryService: CategoryService = new CategoryService()