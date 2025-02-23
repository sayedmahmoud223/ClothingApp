// import categoryModel from "../../../DB/models/catgeoryModel";
// import { eventEmitter } from "../../../utils/eventEmitter";
// import { categoryAdminService } from "./catogryAdminService";
// import cloudinary from "../../../utils/cloudinary"
// import { asyncHandler, ResError } from "../../../utils/errorHandling";


// eventEmitter.on("uploadCategoryImage", async ({ _id, path }) => {
//     try {
//         console.log({ _id, path });
//         const category = await categoryAdminService.categoryNotExist(_id)
//         const { secure_url, public_id } = await cloudinary.uploader.upload(path)
//         if (!secure_url || !public_id) {
//             throw new Error("Cloudinary upload failed: Missing URLs");
//         }
//         console.log({ secure_url, public_id });
//         category.image.secure_url = secure_url
//         category.image.public_id = public_id
//         await category.save()
//         console.log(category);
//     } catch (error) {
//         console.error("Error during image upload:", (error as any).message);
//         // Optionally delete the category if image upload fails
//         await categoryModel.findByIdAndDelete(_id);
//         console.log("Category deleted due to image upload failure");
//     }
// })