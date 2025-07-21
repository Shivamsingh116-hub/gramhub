import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../components/PostCard';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Home = () => {
  const { fetchPost, loading, fetchRandomPost, hasMore } = useContext(AuthContext);
  const posts = fetchPost || [];

  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const debounceTimerRef = useRef(null);

  // ✅ Improvement: Moved welcome screen timer to a named function for clarity
  const handleWelcomeScreen = () => {
    const alreadyShown = sessionStorage.getItem('welcome_shown');

    if (alreadyShown === 'true') {
      setIsWelcomeVisible(false);
    } else {
      const timer = setTimeout(() => {
        setIsWelcomeVisible(false);
        sessionStorage.setItem('welcome_shown', 'true');
      }, 4000);

      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    const cleanup = handleWelcomeScreen();
    return cleanup;
  }, []);

  // ✅ Improvement: Moved scroll check to a reusable function
  const isNearBottom = () => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;
    return scrollY + innerHeight >= scrollHeight - 100;
  };

  // ✅ Scroll logic with debounce
  const handleScroll = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (isNearBottom() && !loading && hasMore) {
        const lastCreatedAt = posts.length > 0 ? posts[posts.length - 1].createdAt : null;
        fetchRandomPost(lastCreatedAt);
      }
    }, 150); // ✅ snappier UX
  }, [posts, loading, hasMore, fetchRandomPost]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ✅ Improvement: Memoized WelcomeScreen to avoid re-renders
  const WelcomeScreen = useCallback(() => (
    <motion.div
      key="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-center px-4"
    >
      <h1 className="text-5xl sm:text-6xl font-extrabold text-cyan-700 tracking-wide mb-2 animate-bounce">
        Welcome to <span className="text-cyan-500">GramHub</span>
      </h1>
      <p className="text-base sm:text-lg text-cyan-600 opacity-90">
        Where your moments meet the world.
      </p>
      <div className="mt-10">
        <p className="text-xs text-gray-600 tracking-wide animate-pulse">
          Loading your personalized feed...
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          If this takes time, the server might be starting up.
        </p>
      </div>
    </motion.div>
  ), []);

  return (
    <div className="relative w-full min-h-screen">
      {/* ✅ Welcome Screen */}
      <AnimatePresence>
        {isWelcomeVisible && <WelcomeScreen />}
      </AnimatePresence>

      {/* ✅ Feed */}
      {!loading && !isWelcomeVisible && (
        <div className="md:pt-10 md:px-4 w-full md:max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: 'easeOut',
                  }}
                >
                  <PostCard postData={post} />
                </motion.div>
              ))
            ) : (
              <motion.p
                className="text-center text-sm text-gray-500 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No posts available.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ✅ Loader */}
      {loading && !isWelcomeVisible && <Loader />}
    </div>
  );
};

export default Home;
