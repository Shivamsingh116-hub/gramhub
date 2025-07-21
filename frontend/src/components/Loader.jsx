import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ size = 'md' }) => {
  // ✅ Disable body scroll while loader is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ✅ Class mapping for loader size
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    // ✅ AnimatePresence used for conditional mounting/unmounting
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ✅ Spinning Ring */}
        <motion.div
          className={`relative ${sizeClasses[size]}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
