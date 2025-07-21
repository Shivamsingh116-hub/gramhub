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

  return (
    <div className="w-full flex flex-col items-center mt-6 px-4">
      {/* Search Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-md mb-6"
      >
        <input
          type="text"
          disabled={loading}
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-r-md hover:bg-blue-600 transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Result Section */}
      <AnimatePresence>
        {showData.length > 0 && (
          <motion.div
            className="w-full max-w-lg flex flex-col gap-4"
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
                className="p-4 border rounded-md bg-gray-50 shadow-sm hover:bg-blue-50 transition cursor-pointer flex items-center gap-4"
              >
                {user.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={user.username}
                    className="w-14 h-14 rounded-full object-cover aspect-square"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold uppercase">
                    {user.username.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-gray-500 line-clamp-2">{user.bio}</p>
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
