import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FollowersShow = ({ type, data, setIsComponent }) => {
  const follower_id = data._id;
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!follower_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/get/follow-data/${type}?follow_id=${follower_id}`);
        setShowData(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        setShowData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [follower_id, type]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = '');
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="followers-modal"
        className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg my-10 p-6 w-[90%] max-w-md relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => setIsComponent(false)}
            className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold capitalize mb-4">{type}</h2>
          <div className="max-h-96 overflow-y pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {loading ? (
              <Loader />
            ) : showData?.length ? (
              <ul>
                {showData.map((user) => {
                  const hasImage = !!user.avatarURL;
                  const firstLetter = user.username?.charAt(0).toUpperCase() || '?';

                  return (
                    <li
                      role="button"
                      onClick={async () => {
                        await navigate(`/profile-show/${user.username}`);
                        setIsComponent(false);
                      }}
                      key={user._id}
                      className="hover:cursor-pointer flex items-center gap-3 py-2 border-b"
                    >
                      {hasImage ? (
                        <img
                          src={user.avatarURL}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold text-sm">
                          {firstLetter}
                        </div>
                      )}
                      <span>{user.username}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No {type} found.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowersShow;
