import React from 'react';
import { motion } from 'framer-motion';

const messageWords = [
  "This", "Messages", "component", "is", "under", "active", "construction 🚧", 
  "Soon,", "you'll", "chat", "seamlessly", "across", "GramHub 🌐"
];

const Messages = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-blue-50 to-cyan-100 flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-cyan-600 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Messages 📬
      </motion.h1>

      <motion.p
        className="text-center text-cyan-700 text-lg sm:text-xl font-medium max-w-2xl"
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
        {messageWords.map((word, i) => (
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
    </div>
  );
};

export default Messages;
