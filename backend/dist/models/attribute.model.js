import mongoose from "mongoose";
const attributeSchema = new mongoose.Schema({
    attributeName: {
        type: String,
        required: true,
        lowercase: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});
export const Attribute = mongoose.model('Attribute', attributeSchema);
