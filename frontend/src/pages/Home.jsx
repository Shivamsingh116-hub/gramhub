import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../components/PostCard';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { fetchPost, loading, fetchRandomPost, hasMore } = useContext(AuthContext);
  const posts = fetchPost || [];
  const debounceTimerRef = useRef(null);

  const isNearBottom = () => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;
    return scrollY + innerHeight >= scrollHeight - 100;
  };

  const handleScroll = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (isNearBottom() && !loading && hasMore) {
        const lastCreatedAt = posts.length > 0 ? posts[posts.length - 1].createdAt : null;
        fetchRandomPost(lastCreatedAt);
      }
    }, 150);
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

      {/* ✅ Premium Feel Inline Loader (3 bouncing dots) */}
      {loading && (
        <motion.div
          className="flex justify-center items-center min-h-screen"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="w-3 h-3 bg-cyan-500 rounded-full mx-1"
              variants={{
                hidden: { y: 0, opacity: 0.4 },
                visible: {
                  y: [-6, 6, -6],
                  opacity: 1,
                  transition: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 0.6,
                    ease: "easeInOut"
                  }
                }
              }}
            />
          ))}
        </motion.div>
      )}


    </div >
  );
};

export default Home;
