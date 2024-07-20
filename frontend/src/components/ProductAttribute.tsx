import { useSearchParams } from "react-router-dom";
import { useGetAttributeValues } from "../hooks/useGetAttributeValues";
import { Attribute } from "../types";
import { useEffect } from "react";

type Props = {
  attribute: Attribute;
};

const ProductAttribute = ({ attribute }: Props) => {
    const [searchParams,setSearchParams] = useSearchParams();
  const { attributeValues, isAttributesLoading } = useGetAttributeValues(
    attribute._id
  );

  useEffect(() => {
    if(attributeValues.length===0) return;
    setSearchParams((params) => {
      params.set(attribute.attributeName,attributeValues[0]?.attributeValue)
      return params;
    })
  },[attributeValues])

  return (
    <>
      <div className="text-lg font-semibold">{attribute.attributeName}</div>
      <div className="flex flex-wrap gap-2 items-center">
        {isAttributesLoading ? (
          <>Attributes loading...</>
        ) : (
          <>
            {attributeValues.map((value) => {
              return (
                <span onClick={() => setSearchParams((params) => {
                    params.set(attribute.attributeName , value.attributeValue)
                    return params;
                })} key={value._id} className={`cursor-pointer ${searchParams.get(attribute.attributeName)===value.attributeValue? 'font-semibold text-black' : 'text-gray'} `}>{value.attributeValue}</span>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default ProductAttribute;
