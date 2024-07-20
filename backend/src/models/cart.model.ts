import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    cartItemQty:{
        type:Number,
        default:1,
    },
    cartItemAttributes:[{
        attributeName:String,
        attributeValue:String,
    }]
})

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
    },
    cartItems:[cartItemSchema],
})

export const Cart = mongoose.model('Cart',cartSchema);
