import React, { useContext, useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { fetchPost, loading, fetchRandomPost,hasMore } = useContext(AuthContext);
console.log(fetchPost)
  


 useEffect(() => {
  let debounceTimer;

  const handleScroll = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const atBottom = scrollTop + windowHeight >= docHeight - 100;

      if (atBottom && !loading && hasMore) {
        const lastCreatedAt =
          fetchPost?.length > 0 ? fetchPost[fetchPost.length - 1].createdAt : null;
        fetchRandomPost(lastCreatedAt);
      }
    }, 200); // Adjust delay as needed
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [fetchPost, loading, hasMore]);

  return (
    <div className="relative w-full min-h-[100vh] h-full">
      {/* ✅ Fullscreen GramHub Intro */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-center px-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-cyan-700 tracking-wide mb-2 animate-bounce">
            Welcome to <span className="text-cyan-500">GramHub</span>
          </h1>
          <p className="text-base sm:text-lg text-cyan-600 opacity-90">
            Where your moments meet the world.
          </p>

          {/* Soft loading text below */}
          <div className="mt-10">
            <p className="text-xs text-gray-600 tracking-wide animate-pulse">
              loading your personalized feed...
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              If this takes time, the server might be starting up.
            </p>
          </div>
        </div>
      )}

      {/* ✅ Feed (only shows after loading = false) */}
      {!loading && (
        <div className="md:pt-10 md:px-4 w-full md:max-w-2xl mx-auto">
          {fetchPost.length > 0 ? (
            fetchPost.map((post) => (
              <PostCard key={post._id} postData={post} />
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 mt-10">
              No posts available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
