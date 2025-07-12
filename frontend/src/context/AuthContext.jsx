import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
const apiUrl = import.meta.env.VITE_API_URL

export const AuthContext = createContext()
const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loadingCurrentUser, setLoadingCurrentUser] = useState(true)
    const [loading, setLoading] = useState(false)
    const [fetchPost, setFetchPost] = useState([])
    const [hasMore, setHasMore] = useState(true)
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
            const response = await axiosInstance.get(`/auth/me`,
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
    }, [apiUrl])
    const fetchRandomPost = async (lastCreatedAt = null) => {
        setLoading(true);
        try {
            const { data: res } = await axiosInstance.get(`/get/random-post`, {
                params: {
                    lastCreatedAt,
                }
            },
            );

            setFetchPost((prev) => {
                const existingIds = new Set(prev.map(post => post._id));
                const newPosts = res.filter(post => !existingIds.has(post._id));
                return [...prev, ...newPosts];
            });

            if (res.length < 10) setHasMore(false);
        } catch (err) {
            console.error('Failed to fetch random post:', err);
        } finally {
            // delay for intro effect (optional)
            setTimeout(() => setLoading(false), 2000);
        }
    };
    useEffect(() => {
        fetchCurrentUserData()
    }, [fetchCurrentUserData])
    useEffect(() => {
        fetchRandomPost()
        const interval = setInterval(() => {
            fetchRandomPost();
        }, 300000); 

        return () => clearInterval(interval);
    }, [currentUser])

    const data = useMemo(() => ({
        currentUser, setCurrentUser, fetchCurrentUserData,
        loadingCurrentUser, setLoadingCurrentUser, fetchPost, setFetchPost, loading, setLoading, fetchRandomPost,
        isAuthenticated: !!currentUser, hasMore, setHasMore
    }), [currentUser, loadingCurrentUser, fetchCurrentUserData, fetchRandomPost, hasMore, fetchPost, loading])

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider