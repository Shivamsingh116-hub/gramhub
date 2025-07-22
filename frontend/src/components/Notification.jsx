import React from 'react';
import { motion } from 'framer-motion';

const Notification = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-blue-50 to-cyan-100 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white border border-cyan-200 mt-[-150px] rounded-xl shadow-md p-8 w-full max-w-md text-center"
      >
        {/* Icon Placeholder */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-2xl font-bold"
        >
          !
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-cyan-700 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Notifications
        </motion.h2>

        <motion.p
          className="text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          All your alerts and updates will appear here. You’ll be notified about likes, comments, follows, and more.
        </motion.p>

        <motion.div
          className="mt-6 text-gray-400 text-xs italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          No new notifications yet.
        </motion.div>

        <motion.div
          className="mt-10 text-xs text-cyan-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          I will complete and enhance this component later. It’s a work in progress.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Notification;
