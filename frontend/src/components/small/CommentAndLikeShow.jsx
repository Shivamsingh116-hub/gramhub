import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ Framer Motion added

const CommentAndLikeShow = ({ postId, setIsComponent, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (!type || !postId) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axiosInstance.get(
          `/get/fetch-comment-or-like/${postId}?type=${type}`
        );
        setData(data?.[`${type}s`] || []); // ✅ Destructuring and fallback
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, type]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        key="comment-like-container"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 md:h-[50%] h-[56%] w-full bg-white z-40 
                   rounded-tl-3xl rounded-tr-3xl p-4 shadow-lg flex flex-col"
      >
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsComponent(false)}
            className="hover:cursor-pointer"
            aria-label="Close comments or likes panel"
          >
            <CloseOutlinedIcon fontSize="medium" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2 capitalize">{type}s</h2>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No {type}s available.</p>
          ) : (
            <ul className="space-y-2">
              {[...data]
                .reverse()
                .map((item, index) =>
                  type === 'like' ? (
                    <li key={index} className="flex items-center space-x-2 border-b pb-1">
                      <img
                        src={item.avatarURL || '/default-avatar.png'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-gray-700">{item.username}</span>
                    </li>
                  ) : (
                    <li
                      key={index}
                      className="flex items-start space-x-3 border p-2 rounded-md bg-gray-50"
                    >
                      <img
                        src={item.userId.avatarURL || '/default-avatar.png'}
                        alt={`${item.userId.username}'s avatar`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.userId.username}
                        </p>
                        <p className="text-sm text-gray-700">{item.text}</p>
                      </div>
                    </li>
                  )
                )}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentAndLikeShow;
