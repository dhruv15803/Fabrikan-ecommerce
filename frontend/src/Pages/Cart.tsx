import { useContext } from "react"
import { AppContext } from "../Contexts/AppContext"
import { AppContextType } from "../types"
import CartItemCard from "../components/CartItemCard";

const Cart = () => {
  const {cartItems,setCartItems} = useContext(AppContext) as AppContextType;

  return (
    <>
    {cartItems.map((cartItem) => {
      return <CartItemCard key={cartItem._id} cartItem={cartItem}/>
    })}
    </>
  )
}

export default Cart;
