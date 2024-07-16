import mongoose from 'mongoose';
const attributeValueSchema = new mongoose.Schema({
    attributeValue: {
        type: String,
        required: true,
        lowercase: true,
    },
    attributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
    }
});
export const AttributeValue = mongoose.model('AttributeValue', attributeValueSchema);
