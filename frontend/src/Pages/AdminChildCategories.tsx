import { useNavigate, useParams } from "react-router-dom";
import { useGetCategory } from "../hooks/useGetCategory";
import Loader from "../components/Loader";
import { useGetCategoriesByParent } from "../hooks/useGetCategoriesByParent";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import AdminCategoryCard from "../components/AdminCategoryCard";
import axios from "axios";
import { backendUrl } from "../App";
import { useState } from "react";
import { RxArrowLeft } from "react-icons/rx";
import AdminCategoryAttribute from "../components/AdminCategoryAttribute";

const AdminChildCategories = () => {
  const navigate = useNavigate();
  const { parentId } = useParams();
  const { category, isCategoryLoading } = useGetCategory(parentId!);
  const { categories, isCategoriesLoading, setCategories } =
    useGetCategoriesByParent(parentId!);
  const [categoryName, setCategoryName] = useState<string>("");
  const [addCategoryError, setAddCatgoryError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddCatgoryError("");
    try {
      if (categoryName.trim() === "") {
        setAddCatgoryError("Please enter a category");
        setTimeout(() => {
          setAddCatgoryError("");
        }, 4000);
        return;
      }
      setIsSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        {
          categoryName,
          parentCategoryId: parentId,
        },
        { withCredentials: true }
      );
      console.log(response);
      setCategories((prev) => [...prev, response.data.newCategory]);
      setCategoryName("");
    } catch (error: any) {
      console.log(error);
      setAddCatgoryError(
        (error.response.data as { success: boolean; message: string }).message
      );
      setTimeout(() => {
        setAddCatgoryError("");
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCategory = async (id: string) => {
    const oldCategories = categories;
    try {
      const newCategories = categories.filter(
        (parentCategory) => parentCategory._id !== id
      );
      setCategories(newCategories);
      await axios.delete(`${backendUrl}/api/category/delete/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
      setCategories(oldCategories);
    }
  };

  if (isCategoryLoading)
    return (
      <>
        <div className="flex items-center justify-center my-16">
          <Loader color="black" width="80" height="80" />
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      </>
    );

  return (
    <>
      <div>
        <Button
          className="text-red-500 text-lg flex items-center gap-1"
          onClick={() => navigate(-1)}
          variant="link"
        >
          <RxArrowLeft />
          <span>Back</span>
        </Button>
      </div>
      <div className="mb-8">
        {category !== null && <AdminCategoryAttribute category={category} />}
      </div>
      <div className="flex flex-col mx-10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold">
            {category?.categoryName}
          </span>
          <span className="text-xl">Category</span>
        </div>
        <form
          onSubmit={(e) => handleAddCategory(e)}
          className="flex items-center gap-4 py-4"
        >
          <Input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            name="categoryName"
            placeholder={`Enter subcategories under ${category?.categoryName}`}
          />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>
        {addCategoryError !== "" && (
          <div className="text-red-500 my-4">{addCategoryError}</div>
        )}
        {isCategoriesLoading ? (
          <>
            <div className="flex items-center justify-center my-4">
              <Loader height="80" width="80" color="black" />
              <span>Loading...</span>
            </div>
          </>
        ) : categories.length !== 0 ? (
          categories.map((category) => {
            return (
              <AdminCategoryCard
                removeCategory={removeCategory}
                categories={categories}
                setCategories={setCategories}
                category={category}
                key={category._id}
              />
            );
          })
        ) : (
          <>
            <div className="text-gray-500">
              You have no categories under{" "}
              <span className="font-bold">{category?.categoryName}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminChildCategories;
