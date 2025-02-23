import mongoose, { model, Schema, Types } from "mongoose";


export interface ISubcategory extends Document {
    _id: string;
    name: string;
    image: Record<string, string>;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    category: Types.ObjectId
}

const subcategorySchema = new Schema<ISubcategory>({
    name: { type: String, required: true, unique: true },
    image: { secure_url: { type: String, required: true, }, public_id: { type: String, required: true, } },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// subcategorySchema.pre(['findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function () {
//     this.where({ isDeleted: false });
// });

const subcategoryModel = mongoose.models.Subcategory || model<ISubcategory>("Subcategory", subcategorySchema);

export default subcategoryModel;