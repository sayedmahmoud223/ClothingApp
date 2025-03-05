import mongoose, { model, Schema, Types } from "mongoose";


export interface ISubcategory extends Document {
    _id: string;
    name: string;
    image: Record<string, string>;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    category: Types.ObjectId
    isCategoryDeleted: Boolean
    isDeleted: Boolean
}

const subcategorySchema = new Schema<ISubcategory>({
    name: { type: String, required: true, unique: true },
    image: { secure_url: { type: String, required: true, }, public_id: { type: String, required: true, } },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isCategoryDeleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

subcategorySchema.pre(['find', 'findOne', "findOneAndUpdate","countDocuments"], function () {
    this.where({ isDeleted: false, isCategoryDeleted: false });
});

const subcategoryModel = mongoose.models.Subcategory || model<ISubcategory>("Subcategory", subcategorySchema);

export default subcategoryModel;