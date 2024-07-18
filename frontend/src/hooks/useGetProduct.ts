import { useEffect, useState } from "react"
import { Product } from "../types"
import axios from "axios";
import { backendUrl } from "../App";


export const useGetProduct = (productId:string) => {
    const [product,setProduct] = useState<Product | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/product/${productId}`,{
                    signal:controller.signal,
                });
                setProduct(response.data.product);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();

        return () => controller.abort()
    },[productId])

    return {product,isLoading,setProduct}
}