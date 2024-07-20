import { useSearchParams } from "react-router-dom";
import { useGetAttributeValues } from "../hooks/useGetAttributeValues";
import { Attribute } from "../types";

type Props = {
  attribute: Attribute;
};

const ProductAttribute = ({ attribute }: Props) => {
    const [searchParams,setSearchParams] = useSearchParams();
  const { attributeValues, isAttributesLoading } = useGetAttributeValues(
    attribute._id
  );

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
                    params.set(attribute.attributeName , value._id)
                    return params;
                })} key={value._id} className={`text-gray-500 cursor-pointer ${searchParams.get(attribute.attributeName)===value._id ? 'font-semibold text-black' : ''} `}>{value.attributeValue}</span>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default ProductAttribute;
