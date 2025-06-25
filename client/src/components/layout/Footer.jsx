import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Footer = () => (
  <Motion.footer
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="bg-white/80 backdrop-blur-md border-t border-slate-200 py-6 mt-12"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Whiteboard App. All rights reserved.
      </p>
      <div className="mt-2 flex justify-center space-x-4">
        <Link
          to="https://x.com/avishkarkakde"
          target="_blank"
          className="text-gray-500 hover:text-indigo-500 transition-colors p-2 hover:bg-indigo-50 rounded-full"
          aria-label="Twitter"
        >
          <Twitter className="w-5 h-5" />
        </Link>
        <Link
          to="https://github.com/avishkar2004"
          target="_blank"
          className="text-gray-500 hover:text-indigo-500 transition-colors p-2 hover:bg-indigo-50 rounded-full"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </Link>
      </div>
    </div>
  </Motion.footer>
);

export default Footer; 