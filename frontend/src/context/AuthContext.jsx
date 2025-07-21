import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchPost, setFetchPost] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Improvement: Removed redundant `apiUrl` and used base URL from axiosInstance

  // ✅ Improvement: Centralized token validation logic
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ Improvement: Memoized and cleaned user fetching
  const fetchCurrentUserData = useCallback(async () => {
    setLoadingCurrentUser(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentUser(null);
      setLoadingCurrentUser(false);
      return;
    }

    try {
      const res = await axiosInstance.get(`/auth/me`, {
        headers: getAuthHeaders(),
      });

      setCurrentUser(res?.data?.user || null);
    } catch (e) {
      if ([401, 402].includes(e.response?.status)) {
        localStorage.removeItem('token');
      }
      setCurrentUser(null);
      console.error('Error fetching user:', e);
    } finally {
      setLoadingCurrentUser(false);
    }
  }, []);

  // ✅ Improvement: Better naming, deduplicated logic, optional prepending
  const fetchRandomPost = useCallback(
    async (lastCreatedAt = null, prepend = false) => {
      setLoading(true);
      try {
        const { data: res } = await axiosInstance.get(`/get/random-post`, {
          params: { lastCreatedAt },
        });

        setFetchPost((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const newPosts = res.filter((p) => !existingIds.has(p._id));
          return prepend ? [...newPosts, ...prev] : [...prev, ...newPosts];
        });

        if (res.length < 10) setHasMore(false);
      } catch (err) {
        console.error('Failed to fetch random post:', err);
      } finally {
        // ⏳ Optional UI delay for loading animation
        setTimeout(() => setLoading(false), 2000);
      }
    },
    []
  );

  // 🔁 Load user on first mount
  useEffect(() => {
    fetchCurrentUserData();
  }, [fetchCurrentUserData]);

  // 🔁 Refresh posts periodically only if user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    fetchRandomPost(); // initial fetch

    const interval = setInterval(fetchRandomPost, 300000); // 5 min interval

    return () => clearInterval(interval);
  }, [currentUser, fetchRandomPost]);

  // ✅ Memoize context to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      fetchCurrentUserData,
      loadingCurrentUser,
      setLoadingCurrentUser,
      fetchPost,
      setFetchPost,
      loading,
      setLoading,
      fetchRandomPost,
      isAuthenticated: !!currentUser,
      hasMore,
      setHasMore,
    }),
    [
      currentUser,
      loadingCurrentUser,
      fetchCurrentUserData,
      fetchPost,
      loading,
      fetchRandomPost,
      hasMore,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
