import { Request, Response } from "express";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            productName,
            productDescription,
            productPrice,
            productCategoryId,
            productSubCategory1Id,
            productImageUrl,
          } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user || !user.isAdmin) return res.status(400).json({"success":false,"message":"User not authorized"});
          // verifying parent category and subcategory to the parent category
          const parentCategory = await Category.findById(productCategoryId);
          const subCategory = await Category.findById(productSubCategory1Id);
          if (!parentCategory || !subCategory)
            return res
              .status(400)
              .json({ success: false, message: "Categories not found" });
        
          if (String(subCategory.parentCategory) !== String(parentCategory._id))
            return res.status(400).json({
              success: false,
              message: "Subcategory does not belong to parent category",
            });
        
          const newProduct = new Product({
            productName: productName.trim(),
            productDescription: productDescription.trim(),
            productPrice: productPrice,
            categoryId: subCategory._id,
            productImage: productImageUrl,
          });
          await newProduct.save();
          return res
            .status(201)
            .json({
              success: true,
              newProduct,
              message: "Successfully created product",
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when creating proudct"});
    }
};

const getAllProducts = async (req:Request,res:Response) => {
    try {
        const products = await Product.find({});
        res.status(200).json({"success":true,products});
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when fetching all products"});
    }
}


export {
    createProduct,
    getAllProducts,
}