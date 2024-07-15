import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        lowercase:true,
    },
    parentCategory:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Category",
        default:null,
    },
},{timestamps:true});

export const Category = mongoose.model('Category',categorySchema);
