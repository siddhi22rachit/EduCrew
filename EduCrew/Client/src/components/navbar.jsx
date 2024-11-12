import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="w-48 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 flex flex-col items-center py-4 gap-6">
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
        StudySync
      </Link>
      <nav className="flex flex-col gap-2 items-center w-full px-2">
        <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
        <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">Chat</Link>
        <Link to="/notes" className="text-gray-300 hover:text-white transition-colors">Notes</Link>
        <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        {/* Add more links as needed */}
      </nav>
      <div className="flex items-center gap-2 text-gray-300 text-lg font-medium bg-gray-800/50 px-4 py-2 rounded-lg">
        <Clock className="w-4 h-4 text-fuchsia-500" />
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
    </div>
  );
};

export default Navbar;
