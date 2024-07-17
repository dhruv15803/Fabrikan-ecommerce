import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { backendUrl } from "../App";
import { Attribute} from "../types";
import { useGetAttributeValues } from "../hooks/useGetAttributeValues";
import Loader from "./Loader";
import AdminAttributeValueCard from "./AdminAttributeValueCard";

type Props = {
  attribute: Attribute;
};

const AdminAttributeValues = ({ attribute }: Props) => {
  const { attributeValues, setAttributeValues, isAttributesLoading } =
    useGetAttributeValues(attribute._id);
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attriubteValueError, setAttributeValueError] = useState<string>("");

  const removeAttributeValue = async (valueId: string) => {
    const oldValues = attributeValues;
    try {
      const newAttributeValues = attributeValues.filter(
        (value) => value._id !== valueId
      );
      setAttributeValues(newAttributeValues);
      await axios.delete(
        `${backendUrl}/api/attribute/attributeValue/${valueId}`,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
      setAttributeValues(oldValues);
    }
  };

  const handleAddAttribute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttributeValueError("");
    if (attributeValue.trim() === "") {
      setAttributeValueError("Please enter a value");
      setTimeout(() => {
        setAttributeValue("");
      }, 4000);
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/attribute/attributeValue/add`,
        {
          attributeValue,
          attributeId: attribute._id,
        },
        { withCredentials: true }
      );
      setAttributeValues((prev) => [...prev, response.data.newAttributeValue]);
      setAttributeValue("");
    } catch (error: any) {
      console.log(error);
      setAttributeValueError(error.response.data.message);
      setTimeout(() => {
        setAttributeValueError("");
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <form
          onSubmit={(e) => handleAddAttribute(e)}
          className="flex items-center gap-2"
        >
          <Input
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
            type="text"
            name="attributeValue"
          />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add value"}
          </Button>
        </form>
        {attriubteValueError !== "" && (
          <div className="text-red-500">{attriubteValueError}</div>
        )}
        {isAttributesLoading ? (
          <>
            <div className="flex items-center gap-2">
              <Loader width="50" height="50" color="black" />
              <span>Loading values</span>
            </div>
          </>
        ) : (
          <>
            {attributeValues.map((value) => {
              return (
                <AdminAttributeValueCard
                  key={value._id}
                  value={value}
                  removeAttributeValue={removeAttributeValue}
                  attributeValues={attributeValues}
                  setAttributeValues={setAttributeValues}
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default AdminAttributeValues;
