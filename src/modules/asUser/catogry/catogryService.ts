import categoryModel from "../../../DB/models/catgeoryModel";
import { ApiFeature } from "../../../utils/apiFeatures";

class CategoryService {
    async readAll(reqParams: any) {
        const readAll = new ApiFeature(categoryModel.find({}), reqParams.query).paginate().filter().search().sort();
        console.log({name:readAll.queryData.search});
        const data = await readAll.mongooseQuery
        const allCount = readAll.queryData.search ?
            await categoryModel.countDocuments({ name: readAll.queryData.search })
            : await categoryModel.countDocuments({})
        const allPages = Math.ceil(allCount / readAll.queryData.size)
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size, allPages }
    }
    async readOne() {

    }
}

export const categoryService: CategoryService = new CategoryService()