import React, { useState } from "react";
import { Category } from "../types";
import { useGetAttributes } from "../hooks/useGetAttributes";
import Loader from "./Loader";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { backendUrl } from "../App";
import AdminAttributeCard from "./AdminAttributeCard";

type Props = {
  category: Category;
};

const AdminCategoryAttribute = ({ category }: Props) => {
  const { attributes, isAttributesLoading, setAttributes } = useGetAttributes(
    category._id
  );
  const [isAddAttribute, setIsAddAttribute] = useState<boolean>(false);
  const [attributeName, setAttributeName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attributeError, setAttributeError] = useState<string>("");

  const handleCreateAttribute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttributeError("");
    try {
      if (attributeName.trim() === "") {
        setAttributeError("Please enter a attribute");
        setTimeout(() => {
          setAttributeError("");
        }, 4000);
        return;
      }
      setIsSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/attribute/create`,
        {
          attributeName,
          categoryId: category._id,
        },
        { withCredentials: true }
      );
      console.log(response);
      setAttributes((prev) => [...prev, response.data.newAttribute]);
      setAttributeName("");
    } catch (error: any) {
      console.log(error);
      setAttributeError(error.response.data.message);
      setTimeout(() => {
        setAttributeError("");
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAttribute = async (id: string) => {
    // id - attribute id to be removed
    const oldAttributes = attributes;
    try {
      const newAttributes = attributes.filter(
        (attribute) => attribute._id !== id
      );
      setAttributes(newAttributes);
      await axios.delete(`${backendUrl}/api/attribute/delete/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      setAttributes(oldAttributes);
    }
  };

  if (isAttributesLoading)
    return (
      <>
        <div className="flex items-center justify-center gap-4">
          <Loader width="80" height="80" color="black" />
          <span>Loading category attributes</span>
        </div>
      </>
    );

  return (
    <>
      <div className="mx-10 flex flex-col gap-2">
        <div className="text-xl font-semibold">
          {category?.categoryName} Attributes
        </div>
        <div className="flex">
          <Button
            variant="link"
            onClick={() => setIsAddAttribute((currVal) => !currVal)}
          >
            {isAddAttribute ? "Cancel" : "Add attribute"}
          </Button>
        </div>
        {isAddAttribute && (
          <>
            <div className="flex flex-col gap-2">
              <form
                onSubmit={(e) => handleCreateAttribute(e)}
                className="flex items-center gap-4"
              >
                <Input
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  type="text"
                  name="attributeName"
                  id="attributeName"
                />
                <Button disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add attribute"}
                </Button>
              </form>
              {attributeError !== "" && (
                <div className="text-red-500">{attributeError}</div>
              )}
            </div>
          </>
        )}
        {attributes.map((attribute) => {
          return (
            <AdminAttributeCard
              removeAttribute={removeAttribute}
              key={attribute._id}
              attribute={attribute}
              attributes={attributes}
              setAttributes={setAttributes}
            />
          );
        })}
      </div>
    </>
  );
};

export default AdminCategoryAttribute;
