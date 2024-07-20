import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { AppContextType } from "../types";
import CartItemCard from "../components/CartItemCard";
import axios from "axios";
import { backendUrl } from "../App";

const Cart = () => {
  const { cartItems, setCartItems } = useContext(AppContext) as AppContextType;

  const incrementQty = async (id:string) => {
    const oldItems = cartItems;
    try {
      const newCartItems = cartItems.map((cartItem) => {
        if(cartItem._id===id) {
          return {
            ...cartItem,
            "cartItemQty":cartItem.cartItemQty+1,
          }
        } else {
          return cartItem;
        }
      });
      setCartItems(newCartItems);
      await axios.patch(`${backendUrl}/api/cartItem/increment`,{
        itemId:id,
      },{withCredentials:true});
    } catch (error) {
      console.log(error);
      setCartItems(oldItems);
    }
  }

  const decrementQty = async (id:string) => {
    const oldItems = cartItems;
    try {
      const newCartItems = cartItems.map((cartItem) => {
        if(cartItem._id===id) {
          if(cartItem.cartItemQty <=1) return cartItem;
          return {
            ...cartItem,
            "cartItemQty":cartItem.cartItemQty-1,
          }
        } else {
          return cartItem;
        }
      });
      setCartItems(newCartItems);
      await axios.patch(`${backendUrl}/api/cartItem/decrement`,{
        itemId:id,
      },{withCredentials:true});
    } catch (error) {
      console.log(error);
      setCartItems(oldItems);
    }
  }

  const removeCartItem = async (id: string) => {
    const oldCartItems = cartItems;
    try {
      const newCartItems = cartItems.filter((cartItem) => cartItem._id !== id);
      setCartItems(newCartItems);
      await axios.delete(`${backendUrl}/api/cartItem/remove/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
      setCartItems(oldCartItems);
    }
  };

  return (
    <>
      <div className="flex flex-col mx-10 my-16 gap-2">
        {cartItems.map((cartItem) => {
          return (
            <CartItemCard
              key={cartItem._id}
              cartItem={cartItem}
              removeCartItem={removeCartItem}
              incrementQty={incrementQty}
              decrementQty={decrementQty}
            />
          );
        })}
      </div>
    </>
  );
};

export default Cart;
