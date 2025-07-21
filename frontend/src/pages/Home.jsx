import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../components/PostCard';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Home = () => {
  const { fetchPost, loading, fetchRandomPost, hasMore } = useContext(AuthContext);
  const posts = fetchPost || [];
  const debounceTimerRef = useRef(null);

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



  return (
    <div className="relative w-full min-h-screen">
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
      {loading  && <Loader/>}
    </div>
  );
};

export default Home;
