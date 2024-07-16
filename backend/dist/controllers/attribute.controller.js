import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Attribute } from "../models/attribute.model.js";
const createAttribute = async (req, res) => {
    try {
        const { attributeName, categoryId } = req.body;
        console.log(req.body);
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res.status(400).json({ "success": false, "message": "User not authorized" });
        if (attributeName.trim() === "")
            return res.status(400).json({ "success": false, "message": "Invalid attribute name" });
        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(400).json({ "success": false, "message": "Invalid category id" });
        console.log('category found');
        // check for duplicate attributes in a category  ex : shirts -> size, size
        const attribute = await Attribute.findOne({ $and: [{ categoryId: category._id }, { attributeName: attributeName.trim().toLowerCase() }] });
        if (attribute)
            return res.status(400).json({ "success": false, "message": "Attribute already exists in this category" });
        console.log('about to create attribute');
        const newAttribute = await Attribute.create({ attributeName: attributeName.trim().toLowerCase(), categoryId: category._id });
        res.status(201).json({
            "success": true,
            newAttribute,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when creating attribute" });
    }
};
const removeAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res.status(400).json({ "success": false, "message": "User not authorized" });
        const attribute = await Attribute.findById(id);
        if (!attribute)
            return res.status(400).json({ "success": false, "message": "Invalid attribute id" });
        await Attribute.deleteOne({ _id: attribute._id });
        res.status(200).json({ "success": true, "message": "deleted attribute" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when deleting attribute" });
    }
};
const getAttributesById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(400).json({ "success": false, "message": "Invalid category id" });
        const attributes = await Attribute.find({ categoryId: category._id });
        res.status(200).json({
            "success": true,
            attributes,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when getting attributes" });
    }
};
const editAttribute = async (req, res) => {
    try {
        const { newAttributeName, attributeId } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res.status(400).json({ "success": false, "message": "User not authorized" });
        // while updating attribute name , make sure there are no other same attribute names within the category.
        const attribute = await Attribute.findById(attributeId);
        if (!attribute)
            return res.status(400).json({ "success": false, "message": "Invalid attribute id" });
        const categoryId = attribute.categoryId;
        const isAttribute = await Attribute.findOne({ $and: [{ categoryId: categoryId }, { attributeName: newAttributeName.trim().toLowerCase() }] });
        if (isAttribute)
            return res.status(400).json({ "success": false, "message": "Category already exists" });
        attribute.attributeName = newAttributeName.trim().toLowerCase();
        await attribute.save();
        res.status(200).json({ "success": true, "message": "successfully updated attribute" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when updating attribute" });
    }
};
export { createAttribute, removeAttribute, getAttributesById, editAttribute, };
