import { CartItem } from "../types";
import { Button } from "./ui/button";

type Props = {
  cartItem: CartItem;
  removeCartItem:(id:string) => Promise<void>;
  incrementQty:(id:string) => Promise<void>;
  decrementQty:(id:string) => Promise<void>;
};

const CartItemCard = ({ cartItem,removeCartItem,incrementQty,decrementQty}: Props) => {
  return (
    <>
      <div className="flex flex-col gap-2 border rounded-lg p-4">
        <div className="text-lg font-semibold">
          {cartItem.productId.productName}
        </div>
        <div className="flex items-center gap-2">
          <span>{cartItem.productId.productPrice}</span>
          <span> x {cartItem.cartItemQty} = {cartItem.productId.productPrice * cartItem.cartItemQty}</span>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={cartItem.cartItemQty <=1} onClick={() => decrementQty(cartItem._id)} className="px-2 py-1 border rounded">-</button>
          <span>{cartItem.cartItemQty}</span>
          <button onClick={() => incrementQty(cartItem._id)} className="px-2 py-1 border rounded">+</button>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {cartItem.cartItemAttributes.map((attributeValueMaps,index) => {
            return <div key={index} className="flex items-center gap-1">
              <span className="font-semibold">{attributeValueMaps.attributeName}</span>
              <span>{attributeValueMaps.attributeValue}</span>
            </div>
          })}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => removeCartItem(cartItem._id)} variant="outline">Remove</Button>
        </div>
      </div>
    </>
  );
};

export default CartItemCard;
