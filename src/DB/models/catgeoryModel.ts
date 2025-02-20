import mongoose, { model, Schema, Types } from "mongoose";


export interface ICategory extends Document {
    _id: string;
    name: string;
    image: Record<string, any>;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    customId?: string;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    image: {
        secure_url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        }
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: false },
}, {
    timestamps: true
});

// categorySchema.pre(['findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function () {
//     this.where({ isDeleted: false });
// });

const categoryModel = mongoose.models.Category || model<ICategory>("Category", categorySchema);

export default categoryModel;