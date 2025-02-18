import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  CheckSquare,
  Users,
  Calendar,
  Video,
  BookOpen,
  Home,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      end: true // Ensures this only matches exactly /dashboard
    },
    // { icon: MessageCircle, label: 'Chat', path: '/dashboard/chat' },
    // { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: Users, label: 'Groups', path: '/dashboard/group' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar-page' },
    { icon: Video, label: 'Video Calls', path: '/dashboard/video-calls' },
    // { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900/90 text-gray-400 hover:text-white focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800
        flex flex-col
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-800/50"
          >
            <Home className="w-5 h-5 text-fuchsia-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
             EduCrew
            </span>
          </NavLink>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-all duration-200 
                  ${isActive 
                    ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 text-white' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }
                  group relative`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110
                  ${isMobileMenuOpen ? 'transform-gpu' : ''}`} 
                />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors
              ${isActive 
                ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 text-white' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 mr-3" />
            <div className="flex-1">
              <div className="text-sm font-medium">Profile</div>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;