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
}