import { useEffect, useState } from "react";
import { AttributeValue } from "../types";
import axios from "axios";
import { backendUrl } from "../App";

export const useGetAttributeValues = (attributeId: string) => {
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [isAttributesLoading, setIsAttributesLoading] =
    useState<boolean>(false);

  const fetchAttributeValues = async () => {
    try {
      setIsAttributesLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/attribute/attributeValues/${attributeId}`
      );
      setAttributeValues(response.data.attributeValues);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAttributesLoading(false);
    }
  };
  useEffect(() => {
    fetchAttributeValues();
  }, [attributeId]);

  return { attributeValues, isAttributesLoading, setAttributeValues };
};
