import axios from "axios";
import {  createContext, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL

export const AuthContext = createContext()
const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState('')
    console.log(currentUser)
    const fetchCurrentUserData = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }
        try {
            const response = await axios.get(`${apiUrl}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (response) {
                setCurrentUser(response.data.user)
            }
        } catch (e) {
            if (e.response && e.response.status === 404) {
                localStorage.removeItem('token')
            }
            console.log(e)
        }
    }
    const data = { currentUser, setCurrentUser, fetchCurrentUserData }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider