import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewMsg:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true,
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    }
},{timestamps:true});

export const Review = mongoose.model('Review',reviewSchema);
