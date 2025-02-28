"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const catgeoryModel_1 = __importDefault(require("../../../DB/models/catgeoryModel"));
const apiFeatures_1 = require("../../../utils/apiFeatures");
class CategoryService {
    async readAll(reqParams) {
        const readAll = new apiFeatures_1.ApiFeature(catgeoryModel_1.default.find({}), reqParams.query).paginate().filter().search().sort();
        const data = await readAll.mongooseQuery;
        const allCount = await catgeoryModel_1.default.countDocuments();
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size };
    }
    async readOne() {
    }
}
exports.categoryService = new CategoryService();
