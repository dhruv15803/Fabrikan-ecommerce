import { useEffect, useState } from "react"
import { Category } from "../types"
import axios from "axios";
import { backendUrl } from "../App";

export const useGetCategoriesByParent = (parentId:string) => {
    const [categories,setCategories] = useState<Category[]>([]);
    const [isCategoriesLoading,setIsCategoriesLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCategoriesByParentId = async () => {
            if(parentId.trim()==="") return;
            try {
                setIsCategoriesLoading(true);
                const response = await axios.get(`${backendUrl}/api/category/categories/${parentId}`,{
                    withCredentials:true,
                });
                console.log(response);
                setCategories(response.data.categories);
            } catch (error) {
                console.log(error);
            } finally {
                setIsCategoriesLoading(false);
            }
        }
        fetchCategoriesByParentId();
    },[parentId]);

    return {categories,isCategoriesLoading,setCategories}
}