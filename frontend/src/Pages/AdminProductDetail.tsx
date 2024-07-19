import { useNavigate, useParams } from "react-router-dom";
import { useGetProduct } from "../hooks/useGetProduct";
import Loader from "../components/Loader";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useGetCategory } from "../hooks/useGetCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetCategoriesByParent } from "../hooks/useGetCategoriesByParent";
import axios from "axios";
import { backendUrl } from "../App";
import { ArrowLeft } from "lucide-react";

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  if (!productId) return <>No product id</>;
  const { isLoading, product, setProduct } = useGetProduct(productId);
  const { category: parentCategory } = useGetCategory(
    product !== null ? product.categoryId.parentCategory : ""
  );
  const { parentCategories, isLoading: isParentCategoriesLoading } =
    useGetCategories();

  const [isEditProduct, setIsEditProduct] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductDescription, setNewProductDescription] =
    useState<string>("");
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductFile, setNewProductFile] = useState<File | null>(null);
  const [newProductImageUrl, setNewProductImageUrl] = useState<string>("");
  const [newProductCategory, setNewProductCategory] = useState<string>("");
  const [newSubCategory, setNewSubCategory] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  const {
    categories: subCategories,
    isCategoriesLoading: isSubCategoriesLoading,
  } = useGetCategoriesByParent(newProductCategory);

  // errors
  const [editProductError, setEditProductError] = useState<string>("");
  const toggleEdit = () => {
    if (product === null || parentCategory === null) return;
    if (!isEditProduct) {
      setIsEditProduct(true);
      setNewProductName(product.productName);
      setNewProductDescription(product.productDescription);
      setNewProductPrice(product.productPrice);
      setNewProductCategory(parentCategory._id);
      setNewSubCategory(product.categoryId._id);
      setNewProductImageUrl(product.productImage);
    } else {
      setIsEditProduct(false);
    }
  };

  const editProduct = async () => {
    try {
      setEditProductError("");
      if (product === null) return;
      if (
        newProductName.trim() === "" ||
        newProductDescription.trim() === "" ||
        newProductPrice <= 0 ||
        newProductCategory === "" ||
        newSubCategory === "" ||
        newProductImageUrl === ""
      ) {
        setEditProductError("Please enter all fields");
        return;
      }
      setIsSavingProduct(true);
      const response = await axios.put(
        `${backendUrl}/api/product/edit`,
        {
          newProductName,
          newProductDescription,
          newProductPrice,
          newProductCategory,
          newSubCategory,
          productId: product._id,
          newProductImageUrl,
        },
        { withCredentials: true }
      );
      console.log(response);
      setProduct(response.data.updatedProduct);
      setIsEditProduct(false);
    } catch (error: any) {
      console.log(error);
      setEditProductError(error.response.data.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  useEffect(() => {
    const getImageUrl = async () => {
      if (newProductFile === null) return;
      try {
        setIsImageLoading(true);
        const response = await axios.post(
          `${backendUrl}/api/file/upload`,
          {
            productFile: newProductFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setNewProductImageUrl(response.data.url);
      } catch (error) {
        console.log(error);
      } finally {
        setIsImageLoading(false);
      }
    };
    getImageUrl();
  }, [newProductFile]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <Loader height="80" width="80" color="black" />
            <span>Loading...</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex mx-10 md:mx-16 lg:mx-[20%] mb-4">
            <Button onClick={() => navigate(-1)} variant="link">
              <ArrowLeft/>
              <span>Back</span>
            </Button>
          </div>
          <div className="flex gap-4 mx-10 md:mx-16 lg:mx-[20%] border rounded-lg p-2">
            <div className="flex flex-col gap-2">
              {" "}
              {isEditProduct ? (
                <>
                  {isImageLoading && (
                    <>
                      <div className="flex items-center justify-center">
                        <Loader width="80" height="80" color="black" />
                      </div>
                    </>
                  )}
                  {!isImageLoading && (
                    <>
                      <img
                        className="w-60 rounded-lg"
                        src={newProductImageUrl}
                        alt=""
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <img
                    className="w-60 rounded-lg"
                    src={product?.productImage}
                    alt=""
                  />
                </>
              )}
              {isEditProduct && (
                <label
                  htmlFor="newProductFile"
                  className="border border-black text-center rounded-lg px-4 py-2 hover:bg-gray-600 hover:text-white hover:duration-300"
                >
                  Change image
                </label>
              )}
              <input
                hidden
                id="newProductFile"
                onChange={(e) =>
                  setNewProductFile(e.target.files && e.target.files[0])
                }
                type="file"
              />
            </div>
            <div className="flex flex-col w-full">
              {isEditProduct ? (
                <>
                  <div className="flex flex-col gap-2 my-2">
                    <Label className="text-lg" htmlFor="newProductName">
                      Product Name
                    </Label>
                    <Input
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      type="text"
                      name="newProductName"
                      id="newProductName"
                    />
                  </div>
                  <div className="flex flex-col gap-2 my-2">
                    <Label className="text-lg" htmlFor="newProductDescription">
                      Product description
                    </Label>
                    <Input
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      type="text"
                      id="newProductDescription"
                    />
                  </div>
                  <div className="flex flex-col gap-2 my-2">
                    <Label className="text-lg" htmlFor="newProductPrice">
                      Product price
                    </Label>
                    <Input
                      value={newProductPrice}
                      onChange={(e) =>
                        setNewProductPrice(parseInt(e.target.value))
                      }
                      type="number"
                      id="newProductPrice"
                    />
                  </div>
                  <div className="flex flex-col gap-2 my-2">
                    <Label htmlFor="newParentCategory">Select category</Label>
                    <Select
                      value={newProductCategory}
                      onValueChange={(value) => setNewProductCategory(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {isParentCategoriesLoading ? (
                          <></>
                        ) : (
                          <>
                            {parentCategories.map((parentCategory) => {
                              return (
                                <SelectItem
                                  value={parentCategory._id}
                                  key={parentCategory._id}
                                >
                                  {parentCategory.categoryName}
                                </SelectItem>
                              );
                            })}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 my-2">
                    <Label htmlFor="newSubCategory">Select subcategory</Label>
                    <Select
                      value={newSubCategory}
                      onValueChange={(value) => setNewSubCategory(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {isSubCategoriesLoading ? (
                          <></>
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
                  </div>
                  {editProductError !== "" && (
                    <div className="text-red-500">{editProductError}</div>
                  )}
                </>
              ) : (
                <>
                  <div className="font-semibold flex-col md:flex md:flex-row md:items-center md:justify-between text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                    <div>{product?.productName}</div>
                    <div className="text-gray-500">
                      {product?.categoryId.categoryName}
                    </div>
                  </div>

                  <div className="flex flex-wrap text-lg my-2">
                    {product?.productDescription}
                  </div>
                  <div className="flex items-center gap-1 text-2xl my-4">
                    <span>₹</span>
                    <span>{product?.productPrice}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between mt-4">
                <Button onClick={toggleEdit}>
                  {isEditProduct ? "Cancel" : "Edit product"}
                </Button>
                {isEditProduct && (
                  <Button
                    disabled={isSavingProduct}
                    onClick={editProduct}
                    variant="outline"
                  >
                    Save changes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminProductDetail;
