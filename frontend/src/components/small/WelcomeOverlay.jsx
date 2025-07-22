import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function WelcomeOverlay({ onFinish }) {
  const [canExit, setCanExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanExit(true);
      onFinish();
    }, 5000);

    const exitDelay = setTimeout(() => setCanExit(true), 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitDelay);
    };
  }, [onFinish]);

  const descriptionWords = [
    "Your", "village’s", "social", "feed", "—", "where", "every", "post",
    "tells", "a", "story", "of", "progress,", "pride,", "and", "people.",
    "Clean,", "connected,", "and", "community-first."
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-[9999] bg-gradient-to-r from-white via-blue-50 to-cyan-100 flex flex-col items-center justify-center text-gray-900 overflow-hidden pointer-events-auto"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background visual pulse */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-cyan-300 opacity-20 blur-3xl animate-pulse pointer-events-none"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />

        <motion.h1
          className="text-[2rem] md:text-5xl font-extrabold mb-6 text-center px-6 leading-snug"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Welcome to{" "}
          <motion.span
            className="text-cyan-700 font-bold relative"
            initial={{ textShadow: "0px 0px 0px rgba(0, 200, 255, 0)" }}
            animate={{
              textShadow: "0px 0px 15px rgba(0, 200, 255, 0.7)",
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            GramHub
          </motion.span>
        </motion.h1>

        {/* Word-by-word animated paragraph */}
        <motion.p
          className="text-lg text-center mb-8 px-6 max-w-2xl text-gray-700 leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 1.2,
              },
            },
          }}
        >
          {descriptionWords.map((word, idx) => (
            <motion.span
              key={idx}
              className="inline-block mr-1"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        <motion.button
          onClick={() => canExit && onFinish()}
          disabled={!canExit}
          className="bg-cyan-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter Feed
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

export default WelcomeOverlay;
