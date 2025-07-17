import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../components/PostCard';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Home = () => {
  const { fetchPost, loading, fetchRandomPost, hasMore } = useContext(AuthContext);
  const posts = fetchPost || [];

  const [isShow, setIsShow] = useState(true);
  const debounceTimerRef = useRef(null);

  // Welcome screen logic
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('welcome_shown');

    if (alreadyShown === 'true') {
      setIsShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsShow(false);
      sessionStorage.setItem('welcome_shown', 'true');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        const atBottom = scrollTop + windowHeight >= docHeight - 100;

        if (atBottom && !loading && hasMore) {
          const lastCreatedAt = posts.length > 0 ? posts[posts.length - 1].createdAt : null;
          fetchRandomPost(lastCreatedAt);
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [posts, loading, hasMore]);

  return (
    <div className="relative w-full min-h-[100vh] h-full">

      {/* ✅ Welcome Screen with Framer Motion */}
      <AnimatePresence>
        {isShow && (
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
                loading your personalized feed...
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                If this takes time, the server might be starting up.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Feed */}
      {/* ✅ Feed */}
      {!loading && (
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
                    delay: index * 0.05, // optional stagger
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
      {loading && !isShow && <Loader />}
    </div>
  );
};

export default Home;
