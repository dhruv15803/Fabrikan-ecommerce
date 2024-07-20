import { useEffect, useState } from "react"
import { CartItem } from "../types";
import axios from "axios";
import { backendUrl } from "../App";


export const useGetCartItems = () => {
    const [cartItems,setCartItems] = useState<CartItem[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/cartItem/cartItems`,{
                    withCredentials:true,
                });
                console.log(response);
                setCartItems(response.data.cartItems);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCartItems();
    },[])

    return {cartItems,setCartItems,isLoading}
}