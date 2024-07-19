import axios from "axios";
import { useEffect, useState } from "react"
import { backendUrl } from "../App";
import { Product } from "../types";

export const useGetProducts =  (parentCategoryId?:string,subCategoryId?:string) => {
    const [products,setProducts] = useState<Product[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/product/products?parentCategoryId=${parentCategoryId || ""}&subCategoryId=${subCategoryId || ""}`);
                setProducts(response.data.products);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    },[parentCategoryId,subCategoryId])
    
    return {products,isLoading,setProducts}
} 