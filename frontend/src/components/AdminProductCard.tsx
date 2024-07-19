import { Product } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  product: Product;
  removeProduct: (id: string) => Promise<void>;
};

const AdminProductCard = ({ product, removeProduct }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col p-2 border rounded-lg shadow-md gap-2">
        <img className="rounded-lg w-44" src={product.productImage} alt="" />
        <div className="text-md font-semibold flex flex-wrap">
          {product.productName}
        </div>
        <div className="text-gray-500">{product.categoryId.categoryName}</div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">₹</span>
          <span>{product.productPrice}</span>
        </div>
        <Button
          onClick={() => navigate(`/admin/product/${product._id}`)}
          className="bg-gray-200"
          variant="outline"
        >
          Update
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Remove</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to remove this product?
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeProduct(product._id)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AdminProductCard;
