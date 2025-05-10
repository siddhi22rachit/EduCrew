import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageCircle,
  Calendar,
  Video,
  User,
  Home,
  Menu,
  X,
  Star
} from 'lucide-react';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shootingStars, setShootingStars] = useState([]);

  // Generate shooting stars with randomized properties
  useEffect(() => {
    const stars = Array(3).fill().map((_, i) => ({
      id: i,
      top: Math.random() * 70,
      left: Math.random() * 60,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 15
    }));
    setShootingStars(stars);
  }, []);

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      end: true
    },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: Video, label: 'Video Calls', path: '/dashboard/video-calls' },
    { icon: User, label: 'Groups', path: '/dashboard/group' },
  ];

  // Shooting Star Component
  const ShootingStar = ({ top, left, duration, delay }) => (
    <div 
      className="absolute h-px animate-meteor"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationIterationCount: 'infinite'
      }}
    >
      <div className="w-12 h-px bg-gradient-to-r from-blue-300 to-transparent"></div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/80 border border-blue-500/30 text-blue-400 hover:text-blue-300 focus:outline-none shadow-lg shadow-blue-500/10 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-black overflow-hidden
        flex flex-col border-r border-blue-500/20 backdrop-blur-sm
      `}>
        {/* Stars Background - Contained within sidebar */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Small twinkling stars */}
          {Array(50).fill().map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDuration: `${Math.random() * 5 + 1}s`,
              }}
            />
          ))}
          
          {/* Medium stars with glow */}
          {Array(8).fill().map((_, i) => (
            <div 
              key={`medium-${i}`}
              className="absolute rounded-full bg-white shadow-glow animate-twinkle"
              style={{
                width: `${Math.random() * 2 + 2}px`,
                height: `${Math.random() * 2 + 2}px`,
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.7)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.5,
                animationDuration: `${Math.random() * 3 + 3}s`,
              }}
            />
          ))}
          
          {/* Subtle distant galaxy/nebula glow spots */}
          <div 
            className="absolute bg-blue-500 rounded-full blur-3xl opacity-10"
            style={{
              width: '150px',
              height: '150px',
              top: '70%',
              left: '20%',
              animationDuration: '15s',
            }}
          />
          
          {/* Shooting stars */}
          {shootingStars.map((star) => (
            <ShootingStar 
              key={star.id} 
              top={star.top} 
              left={star.left} 
              duration={star.duration} 
              delay={star.delay} 
            />
          ))}
        </div>

        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-blue-500/30 relative z-10">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-blue-900/20 group"
          >
            <div className="relative">
              <Star className="w-6 h-6 text-blue-400 group-hover:text-blue-300 animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
              EduCrew
            </span>
          </NavLink>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 relative z-10">
          <div className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-300 
                  ${isActive 
                    ? 'bg-blue-900/30 border border-blue-500/50 shadow-md shadow-blue-500/20' 
                    : 'text-blue-100 border border-transparent hover:border-blue-500/30 hover:bg-blue-900/20'
                  }
                  group relative overflow-hidden`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {/* Item background glow effect */}
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                    )}
                    <item.icon className={`w-5 h-5 mr-3 transition-all duration-300 
                      ${isActive ? 'text-blue-300' : 'text-blue-400'} 
                      group-hover:scale-110 group-hover:text-blue-300`} 
                    />
                    <span className={`text-sm font-medium transition-colors duration-300
                      ${isActive ? 'text-blue-200' : 'text-blue-300'} group-hover:text-blue-200`}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator line */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-blue-500/30 relative z-10">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-blue-900/30 border border-blue-500/50 shadow-lg shadow-blue-500/20' 
                : 'text-blue-100 hover:bg-blue-900/20 border border-transparent hover:border-blue-500/30'
              } relative overflow-hidden`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                )}
                <div className="w-10 h-10 rounded-full relative flex-shrink-0 mr-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" style={{ animationDuration: '4s' }}></div>
                  <div className="absolute inset-1 rounded-full bg-blue-900"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-200" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-200">Profile</div>
                  <div className="text-xs text-blue-400">View settings</div>
                </div>
              </>
            )}
          </NavLink>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;