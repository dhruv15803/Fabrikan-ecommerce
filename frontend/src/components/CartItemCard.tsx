import { CartItem } from "../types";

type Props = {
  cartItem: CartItem;
};

const CartItemCard = ({ cartItem }: Props) => {
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
        <div className="flex items-center gap-4 flex-wrap">
          {cartItem.cartItemAttributes.map((attributeValueMaps,index) => {
            return <div key={index} className="flex items-center gap-1">
              <span className="font-semibold">{attributeValueMaps.attributeName}</span>
              <span>{attributeValueMaps.attributeValue}</span>
            </div>
          })}
        </div>
      </div>
    </>
  );
};

export default CartItemCard;
