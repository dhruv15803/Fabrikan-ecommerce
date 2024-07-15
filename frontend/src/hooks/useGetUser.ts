import axios from 'axios'
import { backendUrl } from '../App'
import { useEffect, useState } from 'react'
import { User } from '../types'

export const useGetUser = () => {
    const [user,setUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendUrl}/api/auth/user`,{
                withCredentials:true,
            });
            console.log(response);
            if(response.data.success) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log(error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    },[])

    return {isLoading,user,setUser}
}