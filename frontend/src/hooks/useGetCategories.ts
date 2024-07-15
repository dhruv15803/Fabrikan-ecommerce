import axios from 'axios'
import { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { Category } from '../types';

export const useGetCategories = () => {
    const [parentCategories,setParentCategories] = useState<Category[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const fetchParentCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendUrl}/api/category/parent-categories`,{
                withCredentials:true,
            });
            console.log(response);
            setParentCategories(response.data.parentCategories);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchParentCategories();
    },[]) 

    return {isLoading,parentCategories,setParentCategories}
}