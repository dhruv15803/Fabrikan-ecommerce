import React, { SetStateAction, useState } from "react";
import { AttributeValue } from "../types";
import { EditIcon, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { RxCross1 } from "react-icons/rx";
import { Button } from "./ui/button";
import axios from "axios";
import { backendUrl } from "../App";

type Props = {
  value: AttributeValue;
  removeAttributeValue: (valueId: string) => Promise<void>;
  attributeValues:AttributeValue[];
  setAttributeValues:React.Dispatch<SetStateAction<AttributeValue[]>>;
};

const AdminAttributeValueCard = ({ value, removeAttributeValue,attributeValues,setAttributeValues}: Props) => {
  const [isValueEdit, setIsValueEdit] = useState<boolean>(false);
  const [newAttributeValue, setNewAttributeValue] = useState<string>("");
  const [attributeValueEditError,setAttributeValueEditError] = useState<string>("");

  const toggleEdit = () => {
    if (!isValueEdit) {
      setIsValueEdit(true);
      setNewAttributeValue(value.attributeValue);
    } else {
      setIsValueEdit(false);
      setNewAttributeValue("");
    }
  };

  const editAttributeValue = async (valueId:string) => {
    const oldAttributeValues = attributeValues;
    if(newAttributeValue.trim()==="") {
        setAttributeValueEditError("Please enter a attribute");
        return;
    }
    if(newAttributeValue.trim().toLowerCase()===value.attributeValue) {
        setIsValueEdit(false);
        return;
    }
    try {
        const newAttributeValues = attributeValues.map((attrVal) => {
            if(attrVal._id===valueId) {
                return {
                    ...attrVal,
                    "attributeValue":newAttributeValue.trim().toLowerCase(),
                }
            } else {
                return attrVal;
            }
        });
        setAttributeValues(newAttributeValues);
        await axios.put(`${backendUrl}/api/attribute/attributeValue/edit`,{
            newAttributeValue,
            valueId,
        },{withCredentials:true});
        setIsValueEdit(false);
        setNewAttributeValue("");
    } catch (error:any) {
        console.log(error);
        setAttributeValues(oldAttributeValues);
        setAttributeValueEditError(error.response.data.message);
    }
  }


  return (
    <>
      <div
        key={value._id}
        className="flex items-center justify-between border-b p-2"
      >
        {isValueEdit ? (
          <div className="mr-4 flex flex-col gap-2">
            <Input
              value={newAttributeValue}
              onChange={(e) => setNewAttributeValue(e.target.value)}
            />
            {attributeValueEditError!=="" && <div className="text-red-500">{attributeValueEditError}</div>}
          </div>
        ) : (
          <span>{value.attributeValue}</span>
        )}
        <div className="flex items-center gap-4">
          {!isValueEdit ? (
            <button
              onClick={() => removeAttributeValue(value._id)}
              className="text-red-500"
            >
              <Trash2 />
            </button>
          ) : (
            <Button onClick={() => editAttributeValue(value._id)}>Save</Button>
          )}
          <button onClick={toggleEdit}>
            {isValueEdit ? <RxCross1 /> : <EditIcon />}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminAttributeValueCard;
