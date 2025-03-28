import mongoose, { FilterQuery, Query } from "mongoose";

export class ApiFeature<T> {
    public mongooseQuery: Query<T[], T>;
    public queryData: Record<string, any>;

    constructor(mongooseQuery: Query<T[], T>, queryData: Record<string, any>) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
        console.log({ mongooseQuery: this.mongooseQuery });
        console.log({ query: this.queryData.search });
    }

    paginate(): this {

        let { page, size } = this.queryData;
        page = Number(page) > 0 ? Number(page) : 1;
        size = Number(size) > 0 ? Number(size) : 10;

        this.queryData.page = page; // Store the corrected values
        this.queryData.size = size;

        const skip = (page - 1) * size;
        console.log({ skip });
        console.log({ count: this.mongooseQuery.countDocuments() })
        this.mongooseQuery.limit(size).skip(skip);

        return this;
    }

    filter(): this {
        let filterQuery: Record<string, any> = { ...this.queryData };
        const exclude = ['page', 'size', 'limit', 'fields', 'sort', 'search'];
        exclude.forEach(key => delete filterQuery[key]);

        filterQuery = JSON.parse(
            JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|all)/g, match => `$${match}`)
        );

        this.mongooseQuery.find(filterQuery as FilterQuery<T>);
        return this;
    }

    search(): this {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { ProductName: { $regex: this.queryData.search, $options: "i" } },
                    { name: { $regex: this.queryData.search, $options: "i" } },
                    { description: { $regex: this.queryData.search, $options: "i" } },
                    { size: { $regex: this.queryData.search, $options: "i" } },
                ]
            } as FilterQuery<T>);
        }
        return this;
    }

    sort(): this {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, " "));
        }
        return this;
    }

    async getAllCount(model: any): Promise<number> {
        const allCount = this?.queryData?.search ?
            await model.countDocuments({ name: { $regex: this.queryData.search, $options: "i" } })
            : await model.countDocuments()
        console.log({ allCount });
        return allCount
    }

}
