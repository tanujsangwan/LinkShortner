import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brute-bg flex flex-col justify-center items-center px-6 text-center">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.6 }}
        className="text-[8rem] md:text-[12rem] font-black text-brute-yellow drop-shadow-[8px_8px_0px_#000] leading-none mb-4"
      >
        404.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wider mb-10"
      >
        This link doesn't exist.
      </motion.p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', bounce: 0.5 }}
      >
        <Link to="/" className="brute-btn-pink text-xl px-10 py-5">
          GO HOME
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
