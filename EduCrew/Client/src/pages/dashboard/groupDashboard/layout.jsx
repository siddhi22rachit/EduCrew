import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Edit2, MessageCircle, Crown, CheckCircle, Clock ,Trash2} from "lucide-react";

import TaskBox from "./task";
import ProgressBox from "./progress";
import ResourceBox from "./resourses";
import MembersBox from "./Members";

const Dashboard = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in localStorage.");
        return;
      }

      try {
        console.log("🔹 Fetching Group Details for:", groupId);

        const response = await axios.get(
          `http://localhost:5000/api/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("🚀 Full Group Response Data:", response.data);

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

  if (loading) return <p className="bg-black text-white p-4">Loading...</p>;
  if (!group)
    return <p className="bg-black text-white p-4">Group not found.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-2 md:p-6 lg:p-8">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-[#0A1128] rounded-lg p-4 mb-3">
        <div className="flex items-center space-x-4 flex-grow">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-500 truncate">
              {group.name || "Unnamed Group"}
            </h1>
            <Edit2 className="text-blue-400 cursor-pointer hover:text-blue-600 w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-red-100 bg-red-600/80 hover:bg-red-600 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out cursor-pointer group">
  <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
  <span className="hidden md:inline text-sm font-medium text-white group-hover:tracking-wider transition-all duration-300">
    Delete Group
  </span>
</div>
          <MessageCircle className="text-blue-400 cursor-pointer hover:text-blue-600 w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskBox groupId={groupId} />
        <ProgressBox groupId={groupId} members={group.members} />
        <ResourceBox groupId={groupId} />
        <MembersBox
          groupId={groupId}
          members={group.members}
          admin={group.admin}
        />
      </div>
    </div>
  );
};

export default Dashboard;
