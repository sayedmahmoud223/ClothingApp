"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeature = void 0;
class ApiFeature {
    mongooseQuery;
    queryData;
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
        console.log({ mongooseQuery: this.mongooseQuery });
        console.log({ query: this.queryData });
    }
    paginate() {
        let { page, size } = this.queryData;
        page = Number(page) > 0 ? Number(page) : 1;
        size = Number(size) > 0 ? Number(size) : 10;
        this.queryData.page = page; // Store the corrected values
        this.queryData.size = size;
        const skip = (page - 1) * size;
        console.log({ skip });
        this.mongooseQuery.limit(size).skip(skip);
        return this;
    }
    filter() {
        let filterQuery = { ...this.queryData };
        const exclude = ['page', 'size', 'limit', 'fields', 'sort', 'search'];
        exclude.forEach(key => delete filterQuery[key]);
        filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|all)/g, match => `$${match}`));
        this.mongooseQuery.find(filterQuery);
        return this;
    }
    search() {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { ProductName: { $regex: this.queryData.search, $options: "i" } },
                    { name: { $regex: this.queryData.search, $options: "i" } },
                    { description: { $regex: this.queryData.search, $options: "i" } },
                    { size: { $regex: this.queryData.search, $options: "i" } },
                ]
            });
        }
        return this;
    }
    sort() {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, " "));
        }
        return this;
    }
}
exports.ApiFeature = ApiFeature;
