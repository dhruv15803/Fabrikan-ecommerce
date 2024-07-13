import { Request, Response } from "express";
import { User} from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async (req:Request,res:Response) => {
    try {
        const newUser = req.body as {email:string;firstName:string;lastName:string;password:string};
        // check if user already exists
        if(req.cookies?.accessToken) {
            res.status(400).json({
                "success":false,
                "message":"auth token already exists",
            })
            return;
        }

        const user = await User.findOne({email:newUser.email.trim().toLowerCase()});
        if(user) return res.status(400).json({"success":false,"message":"Account already exists"});
        
        const hashedPassword = await bcrypt.hash(newUser.password,10);
        const registeredUser = await User.create({email:newUser.email.trim().toLowerCase(),firstName:newUser.firstName,lastName:newUser.lastName,password:hashedPassword});
        
        const token = jwt.sign({userId:registeredUser._id},process.env.JWT_SECRET as string,{
            expiresIn:'1d',
        });
        res.cookie('accessToken',token,{
            httpOnly:true,
            maxAge:1000*60*60*24,
            secure:process.env.NODE_ENV==="production",
        }).status(201).json({
            "success":true,
            "message":"successfully registered user",
            "user":registeredUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when registering user"});
    }
}

const loginUser = async (req:Request,res:Response) => {
    try {
        const {email,password}:{email:string;password:string} = req.body;
        const user = await User.findOne({email:email.trim().toLowerCase()});
        if(!user) return res.status(400).json({"success":false,"message":"Invalid credentials"});
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) return res.status(400).json({"success":false,"message":"Invalid credentials"});
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET as string,{
            expiresIn:'1d',
        });
        res.cookie('accessToken',token,{
            httpOnly:true,
            maxAge:1000*60*60*24,
            secure:process.env.NODE_ENV==="production",
        }).status(201).json({
            "success":true,
            "message":"successfully logged in user",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when loggin in"})
    }
}

const getLoggedInUser = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        res.status(200).json({"success":true,user});
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when getting user"});
    }
}

const logoutUser = async (req:Request,res:Response) => {
    const userId = req.userId;
    res.clearCookie('accessToken').status(200).json({
        "success":true,
        "message":"User logged out"
    });
}

export {
    registerUser,
    loginUser,
    getLoggedInUser,
    logoutUser,
}