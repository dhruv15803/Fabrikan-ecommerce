import React, { createContext } from 'react'
import { AppContextType } from '../types';
import { useGetUser } from '../hooks/useGetUser';
import Loader from '../components/Loader';

export const AppContext = createContext<AppContextType | null>(null);


const AppContextProvider = ({children}:{children:React.ReactNode}) => {
    const {isLoading,user,setUser} = useGetUser();

    if(isLoading) {
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
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;