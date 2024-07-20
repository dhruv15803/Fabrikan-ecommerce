import { useState } from "react";
import AdminAddProductForm from "../components/AdminAddProductForm";
import { Button } from "../components/ui/button";
import { useGetProducts } from "../hooks/useGetProducts";
import Loader from "../components/Loader";
import AdminProductCard from "../components/AdminProductCard";
import axios from "axios";
import { backendUrl } from "../App";
import { useGetCategoriesByParent } from "../hooks/useGetCategoriesByParent";
import { useGetCategories } from "../hooks/useGetCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const AdminProducts = () => {
  const [isAddProduct, setIsAddProduct] = useState<boolean>(false);
  const { parentCategories, isLoading } = useGetCategories();
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const {
    isLoading: isProductsLoading,
    products,
    setProducts,
  } = useGetProducts(parentCategoryId,subCategoryId);
  const {
    categories: subCategories,
    isCategoriesLoading: isSubCategoriesLoading,
  } = useGetCategoriesByParent(parentCategoryId);

  const removeProduct = async (productId: string) => {
    const oldProducts = products;
    try {
      const newProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(newProducts);
      await axios.delete(`${backendUrl}/api/product/${productId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
      setProducts(oldProducts);
    }
  };

  return (
    <>
      <div className="mx-10">
        <Button
          className="text-lg text-gray-600"
          onClick={() => setIsAddProduct((prev) => !prev)}
          variant="link"
        >
          {!isAddProduct ? "Add product" : "Cancel"}
        </Button>
        {isAddProduct && <AdminAddProductForm setProducts={setProducts} />}
      </div>
      <div className="p-4 mx-10 flex items-center gap-4">
        {/* filter by parentcategory */}
        <Select
          value={parentCategoryId}
          onValueChange={(value) => {
            setParentCategoryId(value);
            setSubCategoryId("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <>Loading categories...</>
            ) : (
              <>
                {parentCategories.map((parentCategory) => {
                  return (
                    <SelectItem
                      key={parentCategory._id}
                      value={parentCategory._id}
                    >
                      {parentCategory.categoryName}
                    </SelectItem>
                  );
                })}
              </>
            )}
          </SelectContent>
        </Select>
        {subCategories.length !== 0 && (
          <Select
            value={subCategoryId}
            onValueChange={(value) => setSubCategoryId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by subcategory" />
            </SelectTrigger>
            <SelectContent>
              {isSubCategoriesLoading ? (
                <>Loading subcategories...</>
              ) : (
                <>
                  {subCategories.map((subCategory) => {
                    return (
                      <SelectItem value={subCategory._id} key={subCategory._id}>
                        {subCategory.categoryName}
                      </SelectItem>
                    );
                  })}
                </>
              )}
            </SelectContent>
          </Select>
        )}
      </div>
      {(parentCategoryId !== "" || subCategoryId !== "") && (
        <div className="mx-10 my-2 flex justify-end">
          <Button
            onClick={() => {
              setParentCategoryId("");
              setSubCategoryId("");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      {isProductsLoading && (
        <div className="flex justify-center my-4 items-center">
          <Loader height="80" width="80" color="black" />
          <span className="text-lg font-semibold">Loading products...</span>
        </div>
      )}
      {!isProductsLoading && products.length !== 0 ?  (
        <div className="flex flex-wrap mx-10 my-4 gap-2 p-2">
          {products.map((product) => {
            return (
              <AdminProductCard
                key={product._id}
                product={product}
                removeProduct={removeProduct}
              />
            );
          })}
        </div>
      ):<>
        <div className="flex justify-center items-center gap-2">
          <span className="text-gray-500 text-xl">You have no products</span>
        </div>
      </>}
    </>
  );
};

export default AdminProducts;
