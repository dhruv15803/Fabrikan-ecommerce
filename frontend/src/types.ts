import { SetStateAction } from "react";

export type AppContextType = {
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>
}

export type User = {
    _id:string;
    email:string;
    firstName:string;
    lastName:string;
    isAdmin:boolean;
}

export type Category = {
    _id:string;
    categoryName:string;
    parentCategory:string;
}

export type Attribute = {
    _id:string;
    attributeName:string;
    attributeValues:string[];
    categoryId:string;
}

export type AttributeValue = {
    _id:string;
    attributeValue:string;
    attributeId:string;
}

export type Product = {
    _id:string;
    productName:string;
    productDescription:string;
    productImage:string;
    productPrice:number;
    categoryId:Category;
}