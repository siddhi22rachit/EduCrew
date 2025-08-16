import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import { decodeToken } from '../../../utils/jwtUtils';
import { Users, Plus, Loader2, AlertCircle, Star, ChevronDown } from 'lucide-react';
import moment from 'moment';
import { useAuthStore } from '../../../store/useAuthStore';

const GroupPage = () => {
  const [userGroups, setUserGroups] = useState([]);
    const { authUser, logout, isUserValid } = useAuthStore()
    const [currentTime, setCurrentTime] = useState(new Date())
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [view, setView] = useState('grid'); 
  const navigate = useNavigate();
    const handleLogout = () => {
      logout();
      localStorage.removeItem('token');
      navigate('/sign-in');
    };// 'grid' or 'list'

  useEffect(() => {
    fetchUserGroups();

    // Generate background animation shapes (same as TaskCalendar)
    const newShapes = Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i,
        width: Math.floor(Math.random() * 500 + 300),
        height: Math.floor(Math.random() * 500 + 300),
        left: Math.floor(Math.random() * 100),
        top: Math.floor(Math.random() * 100),
        delay: i * 1.5,
        duration: Math.floor(Math.random() * 15 + 15),
        opacity: Math.random() * 0.04 + 0.02,
      }));
    setShapes(newShapes);
  }, []);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const decoded = decodeToken(token);
      if (!decoded || !decoded.userId) {
        throw new Error('Invalid token');
      }

      const response = await axiosInstance.get(`https://educrew-2.onrender.com/groups/user/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      setUserGroups(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.response?.data?.message || 'Failed to fetch groups');
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  if (error) {
    return (
      <div className="text-center p-4 bg-black text-red-400 min-h-screen flex items-center justify-center">
        <div className="max-w-md px-6 py-8 bg-slate-900/50 rounded-xl border border-red-500/30 shadow-lg">
          <p className="mb-4">{error}</p>
          <button 
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={fetchUserGroups}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-blue-50 flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-black">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full mix-blend-screen filter blur-3xl"
            style={{
              background: shape.id % 3 === 0 
                ? "rgba(59, 130, 246, 0.07)" 
                : shape.id % 3 === 1 
                  ? "rgba(14, 165, 233, 0.05)" 
                  : "rgba(6, 182, 212, 0.03)",
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
              opacity: shape.opacity,
              animation: "pulse 15s infinite ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10 w-full">
        {/* Header */}
        <header className="h-16 border-b border-blue-900/40 flex items-center justify-between px-6 bg-black shadow-lg shadow-blue-900/5">
                  <div className="flex items-center">
                    
                    <h1 className="text-xl font-semibold text-blue-100">Groups</h1>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-blue-200 hidden md:block">{formattedTime}</div>
                    <div className="relative">
                      <button
                        className="flex items-center gap-3 hover:bg-blue-800/20 p-2 px-3 rounded-full transition-all duration-300"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                      >
                        <img
                          src={authUser.profilePic || "/placeholder.svg?height=32&width=32"}
                          alt={authUser.fullName}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md shadow-blue-500/20 object-contain"
                        />
                        <span className="text-sm font-medium text-blue-100">{authUser.fullName}</span>
                        <ChevronDown className="w-4 h-4 text-blue-300" />
                      </button>
        
                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-black border border-blue-900/50 rounded-lg shadow-xl py-1 shadow-blue-900/20 z-50">
                          <button
                            onClick={() => navigate("/profile")}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/30 transition-colors"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => navigate("/settings")}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/30 transition-colors"
                          >
                            Notifications
                          </button>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-950/40 to-black rounded-xl p-6 mb-6 overflow-hidden border border-blue-900/30 shadow-lg shadow-blue-900/5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 blur-3xl scale-150 opacity-30 transition-opacity duration-500" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">My Groups</h2>
                  <p className="text-blue-300 text-sm md:text-base">Manage and access all your collaboration groups</p>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <button 
                    className={`px-4 py-2 text-sm border border-blue-800/50 rounded-l-lg transition-all duration-300 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
                    onClick={() => handleViewChange('grid')}
                  >
                    Grid
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm border-t border-b border-r border-blue-800/50 rounded-r-lg transition-all duration-300 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
                    onClick={() => handleViewChange('list')}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Groups Container */}
            <div className="bg-gradient-to-b from-blue-950/20 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/5 overflow-hidden p-6">
              {userGroups.length > 0 ? (
                view === 'grid' ? (
                  // Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userGroups.map((group) => (
                      <div 
                        key={group._id} 
                        className="bg-gradient-to-b from-blue-950/30 to-black/80 rounded-xl overflow-hidden border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-900/20 transform hover:-translate-y-1"
                      >
                        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-blue-100">{group.groupName}</h3>
                            
                          </div>
                          
                          <p className="text-blue-300 text-sm mb-4 flex items-center">
                            <span className="inline-block w-5 h-5 rounded-full bg-blue-900/70 text-blue-300 mr-2 flex items-center justify-center text-xs font-medium border border-blue-500/30">
                              A
                            </span>
                            {group.adminEmail}
                          </p>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center text-blue-200 text-sm">
                              <Users className="w-4 h-4 mr-2 text-blue-400" />
                              <span>{group.memberCount} {group.memberCount === 1 ? 'Member' : 'Members'}</span>
                            </div>
                            
                            <Link 
                              to={`/dashboard/group/${group._id}`}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600/80 text-blue-50 text-sm font-medium rounded-lg hover:bg-blue-500 transition-all duration-300"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Create Group Card */}
                    <Link 
                      to="/dashboard/group-form"
                      className="bg-gradient-to-b from-blue-950/10 to-black/60 rounded-xl border border-blue-900/20 border-dashed hover:border-blue-500/40 transition-all duration-300 flex flex-col items-center justify-center p-8 min-h-[200px] shadow-lg hover:shadow-blue-900/20 transform hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center justify-center mb-3">
                        <Plus className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-blue-300 font-medium">Create New Group</p>
                    </Link>
                  </div>
                ) : (
                  // List View
                  <div className="border-t border-blue-900/30">
                    {userGroups.map((group, index) => (
                      <div 
                        key={group._id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between py-4 ${
                          index < userGroups.length - 1 ? 'border-b border-blue-900/30' : ''
                        }`}
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="text-lg font-semibold text-blue-100 flex items-center">
                            {group.groupName}
                            <Star className="w-4 h-4 text-yellow-400 ml-2" />
                          </h3>
                          <p className="text-blue-300 text-sm mt-1">{group.adminEmail}</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                          <div className="flex items-center text-blue-200 text-sm mr-4">
                            <Users className="w-4 h-4 mr-2 text-blue-400" />
                            <span>{group.memberCount} {group.memberCount === 1 ? 'Member' : 'Members'}</span>
                          </div>
                          
                          <Link 
                            to={`/dashboard/group/${group._id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600/80 text-blue-50 text-sm font-medium rounded-lg hover:bg-blue-500 transition-all duration-300"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {/* Create Group Button in List View */}
                    <div className="pt-6">
                      <Link 
                        to="/dashboard/group-form"
                        className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-md hover:shadow-blue-500/20"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="font-medium">Create New Group</span>
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="bg-blue-900/30 p-6 rounded-full mb-6 border border-blue-400/30 shadow-lg shadow-blue-500/20">
                    <Users className="w-12 h-12 text-blue-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-100 mb-3">No Groups Yet</h3>
                  <p className="text-blue-300 mb-8 text-center max-w-md">
                    You haven't joined any groups yet. Create your first group to start collaborating.
                  </p>
                  <Link 
                    to="/dashboard/group-form"
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="font-medium">Create Your First Group</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Info Section */}
            {userGroups.length > 0 && (
              <div className="mt-6 bg-blue-950/20 rounded-xl border border-blue-900/30 p-4">
                <h3 className="text-lg font-medium text-blue-100 mb-3">Group Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/10 p-4 rounded-lg border border-blue-800/30">
                    <p className="text-sm text-blue-300">Total Groups</p>
                    <p className="text-2xl font-bold text-blue-100">{userGroups.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/10 p-4 rounded-lg border border-blue-800/30">
                    <p className="text-sm text-blue-300">Groups As Admin</p>
                    <p className="text-2xl font-bold text-blue-100">
                      {userGroups.filter(group => group.isAdmin).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/10 p-4 rounded-lg border border-blue-800/30">
                    <p className="text-sm text-blue-300">Total Members</p>
                    <p className="text-2xl font-bold text-blue-100">
                      {userGroups.reduce((total, group) => total + group.memberCount, 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/10 p-4 rounded-lg border border-blue-800/30">
                    <p className="text-sm text-blue-300">Last Updated</p>
                    <p className="text-2xl font-bold text-blue-100">{moment().format('MMM DD')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupPage;