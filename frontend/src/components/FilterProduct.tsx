import React, { SetStateAction, useEffect, useState } from "react";
import { Product } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetCategoriesByParent } from "../hooks/useGetCategoriesByParent";
import axios from "axios";
import { backendUrl } from "../App";

type Props = {
    setProducts:React.Dispatch<SetStateAction<Product[]>>;
}

const FilterProduct = ({setProducts}:Props) => {
    const {parentCategories,isLoading} = useGetCategories();
    const [parentCategoryId,setParentCategoryId] = useState<string>("");
    const [subCategoryId,setSubCategoryId] = useState<string>("");
    const {categories:subCategories,isCategoriesLoading:isSubCategoriesLoading} = useGetCategoriesByParent(parentCategoryId);

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/product/products?parentCategoryId=${parentCategoryId}&subCategoryId=${subCategoryId}`);
                setProducts(response.data.products);
            } catch (error) {
                console.log(error);
            }
        }
        fetchProductsData();
    },[parentCategoryId,subCategoryId]);

  return (
    <>
      <div className="border p-4 rounded-lg mx-10 flex items-center gap-4">
        {/* filter by parentcategory */}
        <Select value={parentCategoryId} onValueChange={(value) => setParentCategoryId(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Filter by category"/>
            </SelectTrigger>
            <SelectContent>
                {isLoading ? <>Loading categories...</> : <>
                    {parentCategories.map((parentCategory) => {
                        return <SelectItem key={parentCategory._id} value={parentCategory._id}>{parentCategory.categoryName}</SelectItem>
                    })}
                </>}
            </SelectContent>
        </Select>
        {subCategories.length!==0 && <Select value={subCategoryId} onValueChange={(value) => setSubCategoryId(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by subcategory"/>
                </SelectTrigger>
                <SelectContent>
                    {isSubCategoriesLoading ? <>Loading subcategories...</> : <>
                        {subCategories.map((subCategory) => {
                            return <SelectItem value={subCategory._id} key={subCategory._id}>{subCategory.categoryName}</SelectItem>
                        })}
                    </>}
                </SelectContent>
            </Select>}
      </div>
    </>
  );
};

export default FilterProduct;
