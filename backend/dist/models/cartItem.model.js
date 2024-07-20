import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    cartItemQty: {
        type: Number,
        default: 1,
    },
    cartItemAttributes: [{
            attributeName: String,
            attributeValue: String,
        }],
});
export const CartItem = mongoose.model('CartItem', cartItemSchema);
