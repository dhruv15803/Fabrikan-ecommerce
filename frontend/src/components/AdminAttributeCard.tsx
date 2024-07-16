import React, { SetStateAction, useState } from "react";
import { Attribute } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { backendUrl } from "../App";

type Props = {
  attribute: Attribute;
  removeAttribute: (id: string) => Promise<void>;
  attributes: Attribute[];
  setAttributes: React.Dispatch<SetStateAction<Attribute[]>>;
};

const AdminAttributeCard = ({
  attribute,
  removeAttribute,
  attributes,
  setAttributes,
}: Props) => {
  const [isAttributeEdit, setIsAttributeEdit] = useState<boolean>(false);
  const [newAttributeName, setNewAttributeName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [attributeEditError, setAttributeEditError] = useState<string>("");

  const editAttribute = async (id: string) => {
    const oldAttributes = attributes;
    setAttributeEditError("");
    if (newAttributeName.trim().toLowerCase() === attribute.attributeName)
      return;
    if (newAttributeName.trim() === "") {
      setAttributeEditError("Please enter an attribute");
      setTimeout(() => {
        setAttributeEditError("");
      }, 4000);
      return;
    }
    try {
      setIsUpdating(true);
      const newAttributes = attributes.map((attribute) => {
        if (attribute._id === id) {
          return {
            ...attribute,
            attributeName: newAttributeName.trim().toLowerCase(),
          };
        } else {
          return attribute;
        }
      });
      setAttributes(newAttributes);
      await axios.put(
        `${backendUrl}/api/attribute/edit`,
        {
          newAttributeName,
          attributeId: id,
        },
        { withCredentials: true }
      );
      setIsAttributeEdit(false);
      setNewAttributeName("");
    } catch (error: any) {
      setAttributes(oldAttributes);
      setAttributeEditError(error.response.data.message);
      setTimeout(() => {
        setAttributeEditError("");
      }, 4000);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleEdit = () => {
    if (!isAttributeEdit) {
      setIsAttributeEdit(true);
      setNewAttributeName(attribute.attributeName);
    } else {
      setIsAttributeEdit(false);
      setNewAttributeName("");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b p-4">
        <div className="text-lg font-semibold">
          {isAttributeEdit ? (
            <div className="flex flex-col gap-2">
              <Input
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                type="text"
              />
              {attributeEditError !== "" && (
                <div className="text-red-500">{attributeEditError}</div>
              )}
            </div>
          ) : (
            <>{attribute.attributeName}</>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isAttributeEdit && (
            <Button
              onClick={() => removeAttribute(attribute._id)}
              variant="destructive"
            >
              Remove
            </Button>
          )}
          {isAttributeEdit && (
            <Button
              disabled={isUpdating}
              onClick={() => editAttribute(attribute._id)}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          )}
          <Button onClick={toggleEdit} variant="outline">
            {isAttributeEdit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminAttributeCard;
