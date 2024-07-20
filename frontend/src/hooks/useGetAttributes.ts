import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { Attribute } from "../types";

export const useGetAttributes = (categoryId: string) => {    
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isAttributesLoading, setIsAttributesLoading] =
    useState<boolean>(false);
      
  useEffect(() => {
    const fetchAttributesByCategory = async () => {
      if(categoryId==="") return;
      try {
        setIsAttributesLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/attribute/attributes/${categoryId}`
        );
        console.log(response);
        setAttributes(response.data.attributes);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAttributesLoading(false);
      }
    };
    fetchAttributesByCategory();
  }, [categoryId]);

  return { isAttributesLoading, attributes, setAttributes };
};
