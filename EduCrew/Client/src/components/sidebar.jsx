import React from 'react';
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
  Home
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageCircle, label: 'Chat', path: '/dashboard/chat' },
    { icon: FileText, label: 'Notes', path: '/dashboard/notes' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: Users, label: 'Groups', path: '/dashboard/group' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: Video, label: 'Video Calls', path: '/dashboard/calls' },
    { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' }
  ];

  return (
    <div className="w-48 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 flex flex-col items-center py-4 gap-6">
      <a href="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
        <Home className="w-5 h-5" />
        StudySync
      </a>
      
      <nav className="flex flex-col gap-2 items-center flex-1 w-full px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 hover:bg-fuchsia-500/10 group ${
                isActive ? 'bg-fuchsia-500/20 text-fuchsia-500' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 mr-3" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default  Sidebar;