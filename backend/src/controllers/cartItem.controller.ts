import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { CartItem } from "../models/cartItem.model.js";

const addCartItem = async (req: Request, res: Response) => {
    const { productId, attributes }:{ productId: string; attributes: { attributeName: string; attributeValue: string }[] } = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false, message: "Invalid user id" });

        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ success: false, message: "Invalid product id" });

        let newCartItem;
        const cartItems = await CartItem.find({ userId: user._id });
        let isDuplicate = false;

        for (let i = 0; i < cartItems.length; i++) {
            if (String(cartItems[i].productId) === String(product._id)) {
                const dbAttributes = cartItems[i].cartItemAttributes;
                if (attributes.length !== dbAttributes.length) continue;

                let isAttributesDiff = false;
                for (let j = 0; j < attributes.length; j++) {
                    if ((attributes[j].attributeName !== dbAttributes[j].attributeName) || 
                        (attributes[j].attributeValue !== dbAttributes[j].attributeValue)) {
                        isAttributesDiff = true;
                        break;
                    }
                }

                if (isAttributesDiff) continue;
                isDuplicate = true;
                newCartItem = await CartItem.findByIdAndUpdate(
                    cartItems[i]._id,
                    { $set: { cartItemQty: cartItems[i].cartItemQty + 1, cartItemAttributes: attributes } },
                    { new: true }
                ).populate('productId');
                break;
            }
        }

        if (!isDuplicate) {
            newCartItem = await CartItem.create({ productId: product._id, userId: user._id, cartItemAttributes: attributes });
            newCartItem = await CartItem.findOne({ _id: newCartItem._id }).populate('productId');
        }

        const latestCartItems = await CartItem.find({userId:user._id}).populate('productId');
        return res.status(200).json({ success: true, message: "Added cart item", newCartItem ,latestCartItems});
    } catch (error:any) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error });
    }
};


const removeCartItem = async (req:Request,res:Response) => {
    try {
        const {itemId} = req.params;
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({"success":false,"message":"Invalid userid"});
        const cartItem = await CartItem.findOne({$and:[{userId:user._id},{_id:itemId}]});
        if(!cartItem) return res.status(400).json({"success":false,"message":"Invalid cart item id"});
        await CartItem.deleteOne({_id:cartItem._id});
        const latestCartItems = await CartItem.find({userId:user._id}).populate('productId');
        res.status(200).json({"success":true,"message":"Deleted successfully",latestCartItems});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error });
    }
}

const incrementItemQty  = async (req:Request,res:Response) => {
    try {
        const {itemId} = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({"success":false,"message":"Invalid user id"});
        const cartItem = await CartItem.findOne({$and:[{userId:user._id},{_id:itemId}]});
        if(!cartItem) return res.status(400).json({"success":false,"message":"cart item not found"});
        const updatedCartItem = await CartItem.findByIdAndUpdate({_id:cartItem._id},{$set:{cartItemQty:cartItem.cartItemQty+1}},{new:true}).populate('productId');
        const latestCartItems = await CartItem.find({userId:user._id}).populate('productId');
        return res.status(200).json({
            "success":true,
            updatedCartItem,
            "message":"incremented qty"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"something went wrong when incrementing qty"});
    }
}

const decrementItemQty = async (req:Request,res:Response) => {
    try {
        const {itemId} = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({"success":false,"message":"Invalid user id"});
        const cartItem = await CartItem.findOne({$and:[{userId:user._id},{_id:itemId}]});
        if(!cartItem) return res.status(400).json({"success":false,"message":"cart item not found"});
        // check the qty of cartItem , if > 1 then decrement else no
        if(cartItem.cartItemQty <= 1) return res.status(400).json({"success":false,"message":"item qty already at 1"});
        const updatedCartItem = await CartItem.findByIdAndUpdate({_id:cartItem._id},{cartItemQty:cartItem.cartItemQty-1},{new:true}).populate('productId');
        const latestCartItems = await CartItem.find({userId:user._id}).populate('productId');
        return res.status(200).json({
            "success":true,
            updatedCartItem,
            latestCartItems,
            "message":"decrement qty"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"something went wrong when decrementing qty"});
    }
}

const getCartItems = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({"success":false,"message":"Invalid user id"});
        const cartItems = await CartItem.find({userId:user._id}).populate('productId');
        return res.status(200).json({
            "success":true,
            cartItems,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when getting cart items"});
    }
}

export {
    addCartItem,
    removeCartItem,
    incrementItemQty,
    decrementItemQty,
    getCartItems,
};
