import React, { useContext, useState } from 'react';
import { Context } from '../context/Context';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const [query, setQuery] = useState('');
  const { setModalMessage, setPopupModal } = useContext(Context);
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = query.trim().toLowerCase();

    if (!username) {
      setModalMessage('Please enter a username to search.');
      setPopupModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/get/user?username=${username}`);
      if (res?.data) {
        const alreadyExists = showData.some(user => user._id === res.data._id);
        if (alreadyExists) {
          setModalMessage('User already shown below.');
          setPopupModal(true);
        } else {
          setShowData(prev => [...prev, res.data]);
        }
      } else {
        setModalMessage('No user found.');
        setPopupModal(true);
        setShowData([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setModalMessage('Something went wrong. Try again later.');
      setPopupModal(true);
      setShowData([]);
    } finally {
      setLoading(false);
    }
  };

  const fallbackText = "Search for users. Discover stories. Connect instantly with GramHub.";
  const words = fallbackText.split(" ");

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-blue-50 to-cyan-100 flex flex-col items-center justify-start py-12 px-4">
      
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-cyan-600 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Search Users on GramHub 🔍
      </motion.h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-md mb-10 bg-white rounded-lg shadow-md overflow-hidden"
      >
        <input
          type="text"
          disabled={loading}
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-3 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-all"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Fallback Message if no data */}
      {!loading && showData.length === 0 && (
        <motion.div
          className="text-center text-cyan-600 text-lg max-w-xl px-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-xl font-semibold"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {showData.length > 0 && (
          <motion.div
            className="w-full max-w-2xl flex flex-col gap-4 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showData.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                role="button"
                onClick={() => navigate(`/profile-show/${user.username}`)}
                className="p-4 border rounded-xl bg-white shadow-md hover:bg-blue-100 transition cursor-pointer flex items-center gap-4"
              >
                {user.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={user.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-semibold uppercase">
                    {user.username.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
