import { useEffect, useState } from "react";
import { Category } from "../types";
import axios from "axios";
import { backendUrl } from "../App";

export const useGetCategory = (id: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  const fetchCategoryById = async () => {
    if(id==='') return;
    try {
      setIsCategoryLoading(true);
      const response = await axios.get(`${backendUrl}/api/category/${id}`, {
        withCredentials: true,
      });
      setCategory(response.data.category);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryById();
  }, [id]);

  return {category, isCategoryLoading};
};
