import React, { useContext, useState } from 'react';
import { Context } from '../context/Context';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const { setModalMessage, setPopupModal } = useContext(Context);
  const [showData, setShowData] = useState([]);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = query.trim();

    if (!username) {
      setModalMessage('Provide username');
      setPopupModal(true);
      return;
    }

    try {
      setLoading(true)
      const res = await axiosInstance.get(`/get/user?username=${username}`);
      if (res?.data) {
        const exists = showData.some(user => user._id === res.data._id);
        if (!exists) {
          setShowData(prev => [...prev, res.data]);
        }
       
      } else {
        setModalMessage('No user found.');
        setPopupModal(true);
        setShowData([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setModalMessage('Something went wrong while searching.');
      setPopupModal(true);
      setShowData([]);
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="w-full flex flex-col items-center mt-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
        <input
          type="text"
          disabled={loading}
          placeholder="Enter username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-400"
        />
        <button
          disabled={loading}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white border border-blue-500 font-medium rounded-r-md hover:bg-blue-600 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Show Result */}
      {showData.length > 0 && (
        <div className="mt-6 w-full max-w-lg flex flex-col gap-3">
          {showData.map((user) => (
            <div
              key={user._id}
              role="button"
              onClick={() => navigate(`/profile-show/${user.username}`)}
              className="hover:cursor-pointer p-4 border rounded-md bg-gray-50 shadow flex items-center gap-4"
            >
              {user.avatarURL ? (
                <img
                  src={user.avatarURL}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover aspect-square"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold uppercase">
                  {user.username.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold">{user.username}</p>
                {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Search;
