import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit2, MessageCircle, Trash2, Star } from "lucide-react";

import TaskBox from "./task";
import ProgressBox from "./progress";
import ResourceBox from "./resourses";
import MembersBox from "./Members";
import { axiosInstance } from "../../../lib/axios";

// Starry Background Component - Fixed to prevent overflow
const StarryBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      {/* Solid black background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Small twinkling stars */}
      {[...Array(100)].map((_, i) => (
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
      
      {/* Medium stars with glow - reduced count */}
      {[...Array(15)].map((_, i) => (
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
      
      {/* Large stars with stronger glow - reduced count */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={`large-${i}`}
          className="absolute rounded-full bg-blue-50 animate-pulse"
          style={{
            width: `${Math.random() * 3 + 3}px`,
            height: `${Math.random() * 3 + 3}px`,
            boxShadow: '0 0 15px 5px rgba(200, 220, 255, 0.8)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.4,
            animationDuration: `${Math.random() * 4 + 2}s`,
          }}
        />
      ))}
      
      {/* Subtle distant galaxy/nebula glow spots - reduced size */}
      {[...Array(2)].map((_, i) => (
        <div 
          key={`nebula-${i}`}
          className="absolute bg-blue-500 rounded-full blur-3xl animate-pulse opacity-10"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      ))}
    </div>
  );
};

// Shooting Star Component - Fixed positioning
const ShootingStar = () => {
  const topPosition = Math.random() * 70; // Limit to top 70% of screen
  const leftPosition = Math.random() * 80; // Prevent right overflow
  const duration = Math.random() * 2 + 1;
  const delay = Math.random() * 15;
  
  return (
    <div 
      className="fixed h-px animate-meteor"
      style={{
        top: `${topPosition}%`,
        left: `${leftPosition}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationIterationCount: 'infinite'
      }}
    >
      <div className="w-16 h-px bg-gradient-to-r from-white to-transparent"></div>
    </div>
  );
};

const Dashboard = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in localStorage.");
        return;
      }

      try {
        // console.log("🔹 Fetching Group Details for:", groupId);

        const response = await axios.get(
          `https://educrew-2.onrender.com/api/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // console.log("🚀 Full Group Response Data:", response.data);

        if (response.data?.data) {
          setGroup(response.data.data);
        } else {
          console.error("❌ Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error(
          "❌ Error fetching group details:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleDeleteGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found in localStorage.");
        return;
      }
      
      const response = await axiosInstance.delete(
        `/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("🚀 Group deleted successfully:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error deleting group:", error.response?.data || error);
    }
  };

  // Enhanced confirmation dialog component
  const DeleteConfirmDialog = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/80 border border-red-500/30 p-6 rounded-lg max-w-md w-full shadow-xl shadow-red-500/10 animate-fadeIn">
        <h3 className="text-xl font-bold mb-4 text-red-300">Delete Group</h3>
        <p className="mb-6 text-gray-300">Are you sure you want to delete this group? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button 
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-all duration-300 border border-red-500/50 shadow-lg hover:shadow-red-500/30"
            onClick={() => {
              handleDeleteGroup();
              setShowDeleteConfirm(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen w-full overflow-hidden">
      <StarryBackground />
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-300 animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (!group) return (
    <div className="min-h-screen w-full overflow-hidden">
      <StarryBackground />
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <p className="text-blue-300">Group not found.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black">
      <StarryBackground />
      {/* Reduced number of shooting stars */}
      {[...Array(3)].map((_, i) => (
        <ShootingStar key={i} />
      ))}
      
      <div className="relative z-10 max-w-full p-2 md:p-6 lg:p-8 mx-auto">
        {showDeleteConfirm && <DeleteConfirmDialog />}
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center bg-black/70 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center space-x-4 flex-grow overflow-hidden">
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="relative overflow-hidden">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 truncate max-w-xs md:max-w-sm lg:max-w-md">
                  {group.name || "Unnamed Group"}
                </h1>
                <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
              </div>
              <Edit2 className="text-blue-400 cursor-pointer hover:text-blue-300 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div 
              className="flex items-center space-x-2 text-red-100 bg-black border border-red-500/30 hover:border-red-500/50 rounded-lg px-3 py-2 cursor-pointer group shadow-sm" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-red-400 group-hover:text-red-300" />
              <span className="hidden md:inline text-sm font-medium text-red-300">
                Delete Group
              </span>
            </div>
            <div className="bg-blue-900/20 rounded-full p-2 border border-blue-500/30 shadow-sm flex-shrink-0">
              <MessageCircle className="text-blue-400 cursor-pointer w-6 h-6 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Fixed width to prevent overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="w-full">
            <TaskBox groupId={groupId} />
          </div>
          <div className="w-full">
            <ProgressBox groupId={groupId} members={group.members} />
          </div>
          <div className="w-full">
            <ResourceBox groupId={groupId} />
          </div>
          <div className="w-full">
            <MembersBox
              groupId={groupId}
              members={group.members}
              admin={group.admin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;