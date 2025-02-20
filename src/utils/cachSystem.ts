import mongoose, { Query } from "mongoose";
import redis from "redis";
import util from "util";

const redisUrl = "redis://127.0.0.1:6379";
const client: any = redis.createClient({ url: redisUrl });
client.hget = util.promisify(client.hget) as any;

const exec = Query.prototype.exec;

declare module "mongoose" {
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = unknown> {
        cache(options?: { hKey?: string }): this;
        isUseCache?: boolean;
        hKey?: string;
    }
}

Query.prototype.cache = function (option: { hKey?: string } = {}): Query<any, any> {
    this.isUseCache = true;
    this.hKey = JSON.stringify(option.hKey) || "";
    console.log({ hKey: this.hKey });
    return this;
};


Query.prototype.exec = async function (): Promise<any> {
    if (!this.isUseCache) {
        console.log("Fetching from MongoDB...");
        return exec.apply(this);
    }

    const key = JSON.stringify({
        ...this.getQuery(),
        collection: this.model.collection.name
    });

    console.log("Cache Key:", key);
    const resultInCache = await client.hget(this.hKey!, key);

    if (resultInCache) {
        console.log("Fetching from Redis Cache...");
        const doc = JSON.parse(resultInCache);
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
    }

    const resultFromMongoDb = await exec.apply(this);
    console.log("Fetching from MongoDB & Caching the result...");
    client.hset(this.hKey!, key, JSON.stringify(resultFromMongoDb));

    return resultFromMongoDb;
};


export const clearCache = (hKey: string) => {
    console.log("Clearing Cache for Hash Key:", hKey);
    client.del(JSON.stringify(hKey));
};
