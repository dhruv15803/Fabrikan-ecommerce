import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { Product } from "../types";

export const useGetProducts = (
  parentCategoryId?: string,
  subCategoryId?: string,
  page?:number,
  perPage?:number,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfProducts,setNoOfProducts] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/product/products?parentCategoryId=${
            parentCategoryId || ""
          }&subCategoryId=${subCategoryId || ""}&page=${page || ""}&perPage=${perPage || ""}`
        );
        setProducts(response.data.products);
        setNoOfProducts(response.data.noOfProducts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [parentCategoryId, subCategoryId,page]);

  return { products, isLoading, setProducts,noOfProducts};
};
