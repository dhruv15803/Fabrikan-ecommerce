import { SetStateAction, useState } from "react";
import { Category } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

type AdminCategoryCardProps = {
  category: Category;
  removeCategory: (id: string) => Promise<void>;
  categories: Category[];
  setCategories: React.Dispatch<SetStateAction<Category[]>>;
};

const AdminCategoryCard = ({
  category,
  removeCategory,
  categories,
  setCategories,
}: AdminCategoryCardProps) => {
  const [isCategoryEdit, setIsCategoryEdit] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const navigate = useNavigate();

  const editCategory = async (id: string) => {
    const oldCategories = categories;
    try {
      if (newCategoryName.trim() === "") {
        setEditError("Please enter a category");
        return;
      }
      setEditError("");
      if (newCategoryName.trim().toLowerCase() === category.categoryName)
        return;
      const newCategories = categories.map((c) => {
        if (c._id === id) {
          return {
            ...c,
            categoryName: newCategoryName.trim().toLowerCase(),
          };
        } else {
          return c;
        }
      });
      setCategories(newCategories);
      await axios.put(
        `${backendUrl}/api/category/edit`,
        {
          newCategoryName,
          parentCategoryId: category.parentCategory,
          categoryId: id,
        },
        { withCredentials: true }
      );
      setIsCategoryEdit(false);
      setNewCategoryName("");
    } catch (error: any) {
      console.log(error);
      setCategories(oldCategories);
      setEditError(error.response.data.message);
    }
  };

  const toggleEdit = () => {
    if (!isCategoryEdit) {
      setIsCategoryEdit(true);
      setNewCategoryName(category.categoryName);
    } else {
      setIsCategoryEdit(false);
      setNewCategoryName("");
    }
  };

  return (
    <>
      <div className="flex items-center p-4 border rounded-lg shadow-md justify-between">
        <div className="font-semibold flex flex-wrap">
          {isCategoryEdit ? (
            <div className="flex flex-col gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                type="text"
              />
              {editError !== "" && (
                <div className="text-red-500">{editError}</div>
              )}
            </div>
          ) : (
            <div
              className="cursor-pointer hover:underline hover:underline-offset-8 "
              onClick={() => navigate(`/admin/categories/${category._id}`)}
            >
              {category.categoryName}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCategoryEdit ? (
            <Button
              onClick={() => removeCategory(category._id)}
              variant="destructive"
            >
              Delete
            </Button>
          ) : (
            <Button onClick={() => editCategory(category._id)}>
              Save changes
            </Button>
          )}
          <Button onClick={toggleEdit} variant="outline">
            {isCategoryEdit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminCategoryCard;
