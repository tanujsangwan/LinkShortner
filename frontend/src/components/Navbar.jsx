import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="sticky top-0 z-50 bg-[#FFE500] border-b-[3px] border-black px-6 py-4 flex items-center justify-between"
    >
      <Link to="/" className="inline-block border-[3px] border-black bg-white px-3 py-1 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all">
        <span className="font-black text-black uppercase tracking-wider text-xl">⚡ LinkShifter</span>
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link 
          to="/" 
          className={`font-bold text-black uppercase tracking-widest text-sm transition-all ${isActive('/') ? 'bg-black text-white px-3 py-1 border-[3px] border-black' : 'hover:border-b-[3px] hover:border-black py-1'}`}
        >
          Home
        </Link>
        <Link 
          to="/dashboard" 
          className={`font-bold text-black uppercase tracking-widest text-sm transition-all ${isActive('/dashboard') ? 'bg-black text-white px-3 py-1 border-[3px] border-black' : 'hover:border-b-[3px] hover:border-black py-1'}`}
        >
          Dashboard
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
