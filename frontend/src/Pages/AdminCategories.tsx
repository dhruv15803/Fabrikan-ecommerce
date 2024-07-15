import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";
import { backendUrl } from "../App";
import { useGetCategories } from "../hooks/useGetCategories";
import Loader from "../components/Loader";
import AdminCategoryCard from "../components/AdminCategoryCard";

const AdminCategories = () => {
  const { isLoading, parentCategories, setParentCategories } =
    useGetCategories();
  const [categoryName, setCategoryName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addParentCategoryError, setAddParentCategoryError] =
    useState<string>("");

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setAddParentCategoryError("");
      if (categoryName.trim() === "") {
        setAddParentCategoryError("Please enter a category");
        setTimeout(() => {
          setAddParentCategoryError("");
        }, 4000);
        return;
      }
      setIsSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        {
          categoryName: categoryName,
          parentCategoryId: null,
        },
        { withCredentials: true }
      );
      console.log(response);
      setParentCategories((prev) => [...prev, response.data.newCategory]);
      setCategoryName("");
    } catch (error: any) {
      console.log(error);
      setAddParentCategoryError(
        (error.response.data as { success: boolean; message: string }).message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCategory = async (id: string) => {
    const oldCategories = parentCategories;
    try {
      const newCategories = parentCategories.filter(
        (parentCategory) => parentCategory._id !== id
      );
      setParentCategories(newCategories);
      await axios.delete(`${backendUrl}/api/category/delete/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
      setParentCategories(oldCategories);
    }
  };

  return (
    <>
      <div className="flex flex-col mx-10">
        <form
          onSubmit={(e) => handleCategorySubmit(e)}
          className="flex items-center gap-2"
        >
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            type="categoryName"
            placeholder="Enter parent category"
          />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>
        {addParentCategoryError !== "" && (
          <div className="text-red-500">{addParentCategoryError}</div>
        )}
        {isLoading ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader color="black" height="80" width="80" />
            <span className="font-semibold">Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col my-4 gap-4">
            {parentCategories.map((parentCategory) => {
              return (
                <AdminCategoryCard
                  key={parentCategory._id}
                  category={parentCategory}
                  removeCategory={removeCategory}
                  categories={parentCategories}
                  setCategories={setParentCategories}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCategories;
