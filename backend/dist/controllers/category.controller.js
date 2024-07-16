import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
const addCategory = async (req, res) => {
    try {
        const { categoryName, parentCategoryId, } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized user",
            });
            return;
        }
        // categories should be unique with other categories of the hierarchy level
        // top most category
        const category = await Category.findOne({
            categoryName: categoryName.trim().toLowerCase(),
            parentCategory: parentCategoryId,
        });
        //   if category exists -> then duplicate not allowed
        if (category)
            return res.status(400).json({ success: false, message: "Category already exists" });
        const newCategory = await Category.create({
            categoryName: categoryName.trim().toLowerCase(),
            parentCategory: parentCategoryId,
        });
        res.status(201).json({ success: true, newCategory, message: "Created category" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when adding category" });
    }
};
const getParentCategories = async (req, res) => {
    try {
        const parentCategories = await Category.find({ parentCategory: null });
        res.status(200).json({ "success": true, parentCategories });
    }
    catch (error) {
        res.status(500).json({ "success": false, "message": "Something went wrong when fetching categories" });
    }
};
const getCategoriesByParent = async (req, res) => {
    try {
        const { parentCategoryId } = req.params;
        const parentCategory = await Category.findById(parentCategoryId);
        if (!parentCategory)
            return res.status(400).json({ "success": false, "message": "Invalid parent id" });
        const categories = await Category.find({ parentCategory: parentCategory._id });
        res.status(200).json({ "success": true, categories });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when fetching categories" });
    }
};
const removeCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized user",
            });
            return;
        }
        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(400).json({ "success": false, "message": "invalid category id" });
        await Category.deleteOne({ _id: category._id });
        res.status(200).json({ "success": true, "message": "successfully deleted category" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "successs": false, "message": "Something went wrong with deleting category" });
    }
};
const editCategory = async (req, res) => {
    try {
        const { newCategoryName, parentCategoryId, categoryId } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized user",
            });
            return;
        }
        // while editing -> the api will check if another category in the same hierarchy exists 
        const category = await Category.findOne({ categoryName: newCategoryName.trim().toLowerCase(), parentCategory: parentCategoryId });
        if (category)
            return res.status(400).json({ "success": false, "message": "category already exists" });
        await Category.updateOne({ _id: categoryId }, { $set: { categoryName: newCategoryName.trim().toLowerCase() } });
        res.status(200).json({
            "success": true,
            "message": "succesfully updated category"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong with updating category" });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(400).json({ "success": false, "message": "Category not found" });
        res.status(200).json({ "success": true, category });
    }
    catch (error) {
        res.status(500).json({ "success": false, "message": "Something went wrong when getting category" });
    }
};
export { addCategory, getParentCategories, getCategoriesByParent, removeCategory, editCategory, getCategoryById };
