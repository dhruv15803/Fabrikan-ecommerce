import { useParams} from "react-router-dom";
import { useGetProduct } from "../hooks/useGetProduct";
import Loader from "../components/Loader";
import { useGetAttributes } from "../hooks/useGetAttributes";
import ProductAttribute from "../components/ProductAttribute";
import { Button } from "../components/ui/button";
const ProductDetail = () => {
  const { productId } = useParams();
  const { product, isLoading } = useGetProduct(productId ? productId : "");
  const {attributes} = useGetAttributes(product ? product.categoryId._id : '');


  if (product === null) return <>Product not found</>;
  if (isLoading)
    return (
      <>
        <div className="flex items-center justify-center my-20">
          <Loader color="black" width="80" height="80" />
          <span>Getting product...</span>
        </div>
      </>
    );
  return (
    <>
      <div className="flex gap-4 mx-10 md:mx-16 lg:mx-[20%] border rounded-lg p-2 my-24">
        <div className="flex flex-col">
          <img src={product.productImage} className="w-40" alt="" />
        </div>
        <div className="flex flex-col w-full">
          <div className="font-semibold flex flex-col md:flex-row md:items-center md:justify-between text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            <div>{product?.productName}</div>
            <div className="text-gray-500">
              {product?.categoryId.categoryName}
            </div>
          </div>
          <div className="flex flex-wrap text-lg my-2">
            {product?.productDescription}
          </div>
          <div className="flex flex-col gap-2">
            {attributes.map((attribute) => {
                return <ProductAttribute key={attribute._id} attribute={attribute}/>
            })}
          </div>
          <div className="flex items-center gap-1 text-2xl my-4">
            <span>₹</span>
            <span>{product?.productPrice}</span>
          </div>
          <div className="flex justify-end my-2">
            <Button>Add to cart</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
