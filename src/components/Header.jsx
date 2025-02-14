
import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const menuVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="p-3 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Izumii
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
            >
              <motion.div
                layout
                className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center
                ${isDark ? 'bg-gray-800' : 'bg-yellow-400'}`}
                animate={{
                  x: isDark ? 28 : 0,
                  rotate: isDark ? 360 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isDark ? (
                  <FaMoon size={12} className="text-yellow-400" />
                ) : (
                  <FaSun size={12} className="text-white" />
                )}
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 8 : 0
                  }}
                  className="block h-0.5 bg-gray-800 dark:bg-white origin-center"
                />
                <motion.span
                  animate={{
                    opacity: isOpen ? 0 : 1
                  }}
                  className="block h-0.5 bg-gray-800 dark:bg-white"
                />
                <motion.span
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -8 : 0
                  }}
                  className="block h-0.5 bg-gray-800 dark:bg-white origin-center"
                />
              </div>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={menuVariants}
              className="absolute top-full left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
            >
              <nav className="max-w-7xl mx-auto p-4">
                <motion.div
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  }}
                  className="space-y-2"
                >
                  {[
                    { to: "/", label: "Home" },
                    { to: "/public", label: "Public Room" }
                  ].map((link) => (
                    <motion.div
                      key={link.to}
                      variants={{
                        initial: { x: -20, opacity: 0 },
                        animate: { x: 0, opacity: 1 }
                      }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded-lg ${
                          location.pathname === link.to
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        } transition-all`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
