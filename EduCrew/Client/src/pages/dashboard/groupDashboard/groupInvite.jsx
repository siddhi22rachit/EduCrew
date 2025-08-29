import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../../store/useAuthStore"; // Adjust path if needed

const GroupInvite = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const { checkAuth, getUserEmail, isCheckingAuth, isUserValid } = useAuthStore();

  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Wait for auth check to complete and then get user ID
  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isUserValid()) {
      navigate("/sign-in", {
        state: { from: `/dashboard/group/invite/${groupId}` },
      });
    } 
  }, [isCheckingAuth, isUserValid, getUserEmail, navigate, groupId]);

  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data?.data) {
          setGroupName(response.data.data.name);
        } else {
          console.error("❌ Unexpected response structure:", response.data);
        }
      } catch (err) {
        console.error("Failed to fetch group details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  // Accept invitation
  const handleAccept = async () => {
    const userEmail =getUserEmail();

    if (!userEmail) {
      console.error("❌ User not found or not logged in");
      return;
    }
    // console.log(groupId);
    // console.log(userEmail);
    try {
      const token = localStorage.getItem("token");
     

      await axios.post(
        `http://localhost:5000/api/groups/invite/accept`,
        { groupId, email:userEmail }, // Body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      navigate(`/dashboard/group/${groupId}`);
    } catch (err) {
      console.error("Error accepting invite", err);
      console.log("Group ID:", groupId);
console.log("User email:", userEmail);

    }
  };

  const handleReject = () => {
    navigate("/");
  };

  if (isCheckingAuth || loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium">
        Loading group invitation...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📩 Group Invitation
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          You've been invited to join the group:
          <span className="text-blue-600 font-semibold"> {groupName}</span>
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-xl transition"
          >
            ✅ Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-xl transition"
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupInvite;
