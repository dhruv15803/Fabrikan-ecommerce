import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Attribute } from "../models/attribute.model.js";
import { AttributeValue } from "../models/attributeValue.model.js";
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
const addAttributeValue = async (req, res) => {
    try {
        const { attributeValue, attributeId } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res.status(400).json({ "success": false, "message": "User not authorized" });
        const attribute = await Attribute.findById(attributeId);
        if (!attribute)
            return res.status(400).json({ "success": false, "message": "Invalid attribute id" });
        // make sure no duplicate values under the same attribute.
        const value = await AttributeValue.findOne({ $and: [{ attributeId: attribute._id }, { attributeValue: attributeValue.trim().toLowerCase() }] });
        if (value)
            return res.status(400).json({ "success": false, "message": "Attribute value already exists" });
        const newAttributeValue = new AttributeValue({ attributeId: attribute._id, attributeValue: attributeValue.trim().toLowerCase() });
        await newAttributeValue.save();
        res.status(201).json({ "success": true, newAttributeValue });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when adding attribute value" });
    }
};
const getAttributeValues = async (req, res) => {
    try {
        const { attributeId } = req.params;
        const attribute = await Attribute.findById(attributeId);
        if (!attribute)
            return res.status(400).json({ "success": false, "message": "Invalid attribute Id" });
        const attributeValues = await AttributeValue.find({ attributeId: attribute._id });
        res.status(200).json({ "success": true, attributeValues });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when fetching attribute values" });
    }
};
const removeAttributeValue = async (req, res) => {
    try {
        const { valueId } = req.params;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res.status(400).json({ "success": false, "message": "User not authorized" });
        const value = await AttributeValue.findById(valueId);
        if (!value)
            return res.status(400).json({ "success": false, "message": "Attribute value does not exist" });
        await AttributeValue.deleteOne({ _id: value._id });
        res.status(200).json({ "success": true, "message": "deleted attribute value successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when deleting attribute value" });
    }
};
const editAttributeValue = async (req, res) => {
    try {
        const { newAttributeValue, valueId } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.isAdmin)
            return res.status(400).json({ "success": false, "message": "User not authorized" });
        const value = await AttributeValue.findById(valueId);
        if (!value)
            return res.status(400).json({ "success": false, "message": "Invalid value id" });
        // check if there is any same attributes with value as new value under attribute
        const attributeValue = await AttributeValue.findOne({ $and: [{ attributeId: value.attributeId }, { attributeValue: newAttributeValue.trim().toLowerCase() }] });
        if (attributeValue)
            return res.status(400).json({ "success": false, "message": "Attribute value already exists" });
        const updatedAttributeValue = await AttributeValue.findByIdAndUpdate({ _id: value._id }, { $set: { attributeValue: newAttributeValue.trim().toLowerCase() } }, { new: true });
        res.status(200).json({ "success": true, "message": "updated attribute value", updatedAttributeValue });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when updating attribute value" });
    }
};
export { createAttribute, removeAttribute, getAttributesById, editAttribute, addAttributeValue, getAttributeValues, removeAttributeValue, editAttributeValue, };
