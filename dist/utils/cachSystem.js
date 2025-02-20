"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = void 0;
const mongoose_1 = require("mongoose");
const redis_1 = __importDefault(require("redis"));
const util_1 = __importDefault(require("util"));
const redisUrl = "redis://127.0.0.1:6379";
const client = redis_1.default.createClient({ url: redisUrl });
client.hget = util_1.default.promisify(client.hget);
const exec = mongoose_1.Query.prototype.exec;
mongoose_1.Query.prototype.cache = function (option = {}) {
    this.isUseCache = true;
    this.hKey = JSON.stringify(option.hKey) || "";
    console.log({ hKey: this.hKey });
    return this;
};
mongoose_1.Query.prototype.exec = async function () {
    if (!this.isUseCache) {
        console.log("Fetching from MongoDB...");
        return exec.apply(this);
    }
    const key = JSON.stringify({
        ...this.getQuery(),
        collection: this.model.collection.name
    });
    console.log("Cache Key:", key);
    const resultInCache = await client.hget(this.hKey, key);
    if (resultInCache) {
        console.log("Fetching from Redis Cache...");
        const doc = JSON.parse(resultInCache);
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
    }
    const resultFromMongoDb = await exec.apply(this);
    console.log("Fetching from MongoDB & Caching the result...");
    client.hset(this.hKey, key, JSON.stringify(resultFromMongoDb));
    return resultFromMongoDb;
};
const clearCache = (hKey) => {
    console.log("Clearing Cache for Hash Key:", hKey);
    client.del(JSON.stringify(hKey));
};
exports.clearCache = clearCache;
