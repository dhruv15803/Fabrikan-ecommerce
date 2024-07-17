import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { backendUrl } from "../App";
import { Attribute, AttributeValue } from "../types";
import { useGetAttributeValues } from "../hooks/useGetAttributeValues";
import Loader from "./Loader";
import { Trash2 } from "lucide-react";

type Props = {
  attribute: Attribute;
};

const AdminAttributeValues = ({ attribute }: Props) => {
  const { attributeValues, setAttributeValues, isAttributesLoading } =
    useGetAttributeValues(attribute._id);
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attriubteValueError, setAttributeValueError] = useState<string>("");

  const removeAttributeValue = async (valueId:string) => {
    const oldValues = attributeValues;
    try {
        const newAttributeValues = attributeValues.filter((value) => value._id!==valueId);
        setAttributeValues(newAttributeValues);
        await axios.delete(`${backendUrl}/api/attribute/attributeValue/${valueId}`,{
            withCredentials:true,
        });
    } catch (error) {
        console.log(error);
        setAttributeValues(oldValues);
    }
  }


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
              return <div key={value._id} className="flex items-center justify-between border-b p-2">
                <span>{value.attributeValue}</span>
                <button onClick={() => removeAttributeValue(value._id)} className="text-red-500"><Trash2/></button>
              </div>;
            })}
          </>
        )}
      </div>
    </>
  );
};

export default AdminAttributeValues;
