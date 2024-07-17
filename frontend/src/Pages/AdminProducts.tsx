import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useGetCategories } from "../hooks/useGetCategories";
import { useState } from "react";
import { useGetCategoriesByParent } from "../hooks/useGetCategoriesByParent";

const AdminProducts = () => {
  // form fields
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productCategory, setProductCategory] = useState<string>("");
  const [productSubCategory1, setProductSubCategory1] = useState<string>("");
  // data
  const { isLoading, parentCategories: categories } = useGetCategories();
  const {
    categories: subCategories1,
    isCategoriesLoading: isSubCategories1Loading,
  } = useGetCategoriesByParent(productCategory);

  return (
    <>
      <div className="flex flex-col gap-4 mx-10">
        <div className="text-xl font-semibold">Manage products</div>
        <form className="p-4 border flex flex-col rounded-lg shadow-md gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-lg" htmlFor="productName">
              Product Name
            </Label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              name="productName"
              id="productName"
              placeholder="Enter product name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-lg" htmlFor="productDescription">
              Product Description
            </Label>
            <Input
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              type="text"
              name="productDescription"
              id="productDescription"
              placeholder="Enter product description"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-lg" htmlFor="productPrice">
              Product price
            </Label>
            <Input
              value={productPrice}
              onChange={(e) => setProductPrice(parseInt(e.target.value))}
              type="number"
              name="productPrice"
              id="productPrice"
            />
          </div>
          {!isLoading && (
            <div className="flex flex-col gap-2">
              <Label className="text-lg" htmlFor="productCategory">
                Select Category
              </Label>
              <Select
                value={productCategory}
                onValueChange={(value) => setProductCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => {
                    return (
                      <SelectItem value={category._id} key={category._id}>
                        {category.categoryName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          {!isSubCategories1Loading && subCategories1.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Select subcategory 1</Label>
              <Select
                value={productSubCategory1}
                onValueChange={(value) => setProductSubCategory1(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory 1" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories1.map((subCategory) => {
                    return (
                      <SelectItem value={subCategory._id} key={subCategory._id}>
                        {subCategory.categoryName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default AdminProducts;
