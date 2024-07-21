import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
const createProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, productCategoryId, productSubCategory1Id, productImageUrl, } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res
                .status(400)
                .json({ success: false, message: "User not authorized" });
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
        const product = await Product.findOne({ _id: newProduct._id }).populate("categoryId");
        return res.status(201).json({
            success: true,
            product,
            message: "Successfully created product",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong when creating proudct",
        });
    }
};
const getAllProducts = async (req, res) => {
    let products;
    try {
        const { parentCategoryId, subCategoryId, page, perPage } = req.query;
        const pageNumber = parseInt(page);
        const productsPerPage = parseInt(perPage);
        const skip = pageNumber * productsPerPage - productsPerPage;
        let noOfProducts;
        if (parentCategoryId !== "" && subCategoryId === "") {
            const subCategories = await Category.find({ parentCategory: parentCategoryId });
            products = await Product.find({ categoryId: { $in: subCategories } }).skip(skip).limit(productsPerPage).populate('categoryId');
            noOfProducts = await Product.countDocuments({ categoryId: { $in: subCategories } });
        }
        else if (parentCategoryId !== "" && subCategoryId !== "") {
            // check if subCategory falls under parent category
            const subCategory = await Category.findById(subCategoryId);
            if (String(subCategory?.parentCategory) !== parentCategoryId)
                return res.status(400).json({ "success": false, "message": "Subcategory does not fall under parent category" });
            products = await Product.find({ categoryId: subCategoryId }).skip(skip).limit(productsPerPage).populate('categoryId');
            noOfProducts = await Product.countDocuments({ categoryId: subCategoryId });
        }
        else {
            products = await Product.find({}).populate("categoryId").skip(skip).limit(productsPerPage).populate('categoryId');
            noOfProducts = await Product.countDocuments({});
        }
        res.status(200).json({ success: true, products, noOfProducts });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong when fetching all products",
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate("categoryId");
        if (!product)
            return res
                .status(400)
                .json({ success: false, message: "Invalid product id" });
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong when getting product",
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res
                .status(400)
                .json({ success: false, message: "User not authorized" });
        const product = await Product.findById(productId);
        if (!product)
            return res
                .status(400)
                .json({ success: false, message: "Invalid product id" });
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ success: true, message: "deleted product" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong when deleting product",
        });
    }
};
const editProduct = async (req, res) => {
    try {
        const { newProductName, newProductDescription, newProductPrice, newProductCategory, newSubCategory, productId, newProductImageUrl, } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res
                .status(400)
                .json({ success: false, message: "User not authorized" });
        //   make sure product exists for incoming id
        // check the hierarchy of new categories -> that newSubCategory is under newProductCategory
        const product = await Product.findById(productId);
        if (!product)
            return res
                .status(400)
                .json({ success: false, message: "Invalid product id" });
        const parentCategory = await Category.findById(newProductCategory);
        const subCategory = await Category.findById(newSubCategory);
        if (!parentCategory || !subCategory)
            return res
                .status(400)
                .json({ success: false, message: "Categories do no exist" });
        // product and categories exists
        if (String(subCategory.parentCategory) !== String(parentCategory._id))
            return res
                .status(400)
                .json({
                success: false,
                message: "Categories do not fall under same hierarchy",
            });
        await Product.updateOne({ _id: product._id }, {
            $set: {
                productName: newProductName.trim(),
                productDescription: newProductDescription.trim(),
                productImage: newProductImageUrl,
                productPrice: newProductPrice,
                categoryId: subCategory._id,
            },
        });
        const updatedProduct = await Product.findOne({ _id: product._id }).populate('categoryId');
        res
            .status(200)
            .json({ success: true, message: "updated product", updatedProduct });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
            success: false,
            message: "Something went wrong when updating product",
        });
    }
};
export { createProduct, getAllProducts, getProductById, deleteProduct, editProduct, };
