import axios from "axios";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL

export const AuthContext = createContext()
const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loadingCurrentUser, setLoadingCurrentUser] = useState(false)
    const navigate = useNavigate()
    console.log(currentUser)
    const fetchCurrentUserData = useCallback(async () => {
        setLoadingCurrentUser(true)
        const token = localStorage.getItem('token')
        if (!token) {
            setCurrentUser(null)
            setLoadingCurrentUser(false)
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
            const user = response?.data?.user || null;
            setCurrentUser(user);
        } catch (e) {
            if (e.response?.status === 401 || e.response?.status === 402) {
                localStorage.removeItem('token')
            }
            setCurrentUser(null)
            console.log(e)
        } finally {
            setLoadingCurrentUser(false)
        }
    }, [])
    useEffect(() => {
        const checkAuth = async () => {

            await fetchCurrentUserData()
            if (!currentUser) {
                navigate('/login')
            }
        }
        checkAuth()
    }, []);
    const data = useMemo(() => ({
        currentUser, setCurrentUser, fetchCurrentUserData,
        loadingCurrentUser, setLoadingCurrentUser,
        isAuthenticated: !!currentUser
    }), [currentUser, loadingCurrentUser, fetchCurrentUserData])
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider