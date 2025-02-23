import mongoose, { model, Schema, Types } from "mongoose";


export interface ICategory extends Document {
    _id: string;
    name: string;
    image: Record<string, any>;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    customId?: string;
    subcategories: Types.ObjectId[]
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    image: { secure_url: { type: String, required: true, }, public_id: { type: String, required: true, } },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
    subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// categorySchema.pre(['findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function () {
//     this.where({ isDeleted: false });
// });

const categoryModel = mongoose.models.Category || model<ICategory>("Category", categorySchema);

export default categoryModel;