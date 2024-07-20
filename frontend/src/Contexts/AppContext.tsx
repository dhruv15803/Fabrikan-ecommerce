import React, { createContext } from 'react'
import { AppContextType } from '../types';
import { useGetUser } from '../hooks/useGetUser';
import Loader from '../components/Loader';
import { useGetCartItems } from '../hooks/useGetCartItems';

export const AppContext = createContext<AppContextType | null>(null);


const AppContextProvider = ({children}:{children:React.ReactNode}) => {
    const {user,setUser,isLoading} = useGetUser();
    const {cartItems,setCartItems,isLoading:isCartItemsLoading} = useGetCartItems();

    if(isLoading || isCartItemsLoading) {
        return (
            <>
            <div className='flex justify-center items-center my-20 gap-4'>
                <Loader height='100' width='100' color='gray'/>
                <span className='text-gray-600 text-2xl'>Loading...</span>
            </div>
            </>
        )
    }

    return (
        <AppContext.Provider value={{
            loggedInUser:user,
            setLoggedInUser:setUser,
            cartItems:cartItems,
            setCartItems:setCartItems,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;