import React, { useMemo, useState } from "react";
import { useGetProducts } from "../hooks/useGetProducts";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetCategoriesByParent } from "../hooks/useGetCategoriesByParent";
import { Button } from "../components/ui/button";
import Pagination from "../components/Pagination";

const Products = () => {
  const { parentCategories, isLoading: isParentCategoriesLoading } =
    useGetCategories();
  const [page, setPage] = useState<number>(1);
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const {
    categories: subCategories,
    isCategoriesLoading: isSubCategoriesLoading,
  } = useGetCategoriesByParent(parentCategoryId);
  const productsPerPage = 5;
  const { isLoading, products ,noOfProducts} = useGetProducts(    parentCategoryId,
    subCategoryId,
    page,
    productsPerPage);

  const noOfPages = useMemo(() => Math.ceil(noOfProducts/productsPerPage),[noOfProducts])

  return (
    <>
      <div className="flex flex-col mx-10 my-16">
        <div className="text-2xl">Products</div>
        <div className="p-4 flex items-center gap-4">
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
              {isParentCategoriesLoading ? (
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
                        <SelectItem
                          value={subCategory._id}
                          key={subCategory._id}
                        >
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
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap my-4">
          {isLoading ? (
            <>
              <div className="flex items-center my-2 justify-center">
                <Loader color="black" width="60" height="60" />
                <span>Loading products...</span>
              </div>
            </>
          ) : (
            <>
              {products.length !== 0 ? (
                products.map((product) => {
                  return <ProductCard key={product._id} product={product} />;
                })
              ) : (
                <>
                  <div className="flex items-center text-gray-500">
                    No products found
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <Pagination page={page} setPage={setPage} noOfPages={noOfPages}/>
      </div>
    </>
  );
};

export default Products;
