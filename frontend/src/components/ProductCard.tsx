import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { Button } from "./ui/button";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
    const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col border rounded-lg shadow-md p-4">
        <img className="rounded-lg w-44" src={product.productImage} alt="" />
        <div className="text-md font-semibold flex flex-wrap">
          {product.productName}
        </div>
        <div className="text-gray-500">{product.categoryId.categoryName}</div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">₹</span>
          <span>{product.productPrice}</span>
        </div>
        <div className="my-2">
          {" "}
          <Button onClick={() => navigate(`/products/${product._id}`)}>View product</Button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
