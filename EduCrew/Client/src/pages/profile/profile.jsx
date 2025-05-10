import React, { useState, useEffect } from 'react';
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, Mail, User, ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shapes, setShapes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Background animation shapes
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

    // Set up time updater
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/sign-in');
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

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
            <h1 className="text-xl font-semibold text-blue-100">Profile</h1>
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
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-950/40 to-black rounded-xl p-6 mb-6 overflow-hidden border border-blue-900/30 shadow-lg shadow-blue-900/5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 blur-3xl scale-150 opacity-30 transition-opacity duration-500" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">Your Profile</h2>
                  <p className="text-blue-300 text-sm md:text-base">Manage your personal information</p>
                </div>
              </div>
            </div>

            {/* Profile Info Container */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Avatar Section */}
              <div className="bg-gradient-to-b from-blue-950/20 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/5 p-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={selectedImg || authUser?.profilePic || "/placeholder.svg?height=128&width=128"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-600/30"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-0 right-0 
                      bg-blue-600 hover:bg-blue-700 hover:scale-105
                      p-2 rounded-full cursor-pointer 
                      transition-all duration-200 shadow-lg shadow-blue-500/20
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                    `}
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <h3 className="text-xl font-medium text-blue-100 mb-1">{authUser?.fullName}</h3>
                <p className="text-blue-400 text-sm">{authUser?.email}</p>
                <p className="mt-4 text-sm text-blue-300">
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
              </div>

              {/* Profile Details */}
              <div className="md:col-span-2 bg-gradient-to-b from-blue-950/20 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/5 p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-blue-100 border-b border-blue-900/40 pb-2">
                      Personal Information
                    </h3>
                    
                    <div className="space-y-1.5">
                      <div className="text-sm text-blue-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </div>
                      <p className="px-4 py-2.5 bg-blue-900/20 rounded-lg border border-blue-900/40 text-blue-100">
                        {authUser?.fullName}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-sm text-blue-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </div>
                      <p className="px-4 py-2.5 bg-blue-900/20 rounded-lg border border-blue-900/40 text-blue-100">
                        {authUser?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium text-blue-100 border-b border-blue-900/40 pb-2">
                      Account Information
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between py-2 px-4 border-b border-blue-900/20">
                        <span className="text-blue-300">Member Since</span>
                        <span className="text-blue-100">{authUser?.createdAt?.split("T")[0]}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-4">
                        <span className="text-blue-300">Account Status</span>
                        <span className="text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mt-6 bg-gradient-to-b from-blue-950/20 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/5 p-6">
              <h3 className="text-lg font-medium text-blue-100 border-b border-blue-900/40 pb-2 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-blue-200">Profile updated</span>
                  </div>
                  <span className="text-blue-400 text-sm">Just now</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-blue-200">Last login</span>
                  </div>
                  <span className="text-blue-400 text-sm">Today</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;