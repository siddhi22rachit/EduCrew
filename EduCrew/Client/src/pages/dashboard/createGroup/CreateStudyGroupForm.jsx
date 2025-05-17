import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate group name
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      setLoading(false);
      return;
    }

    // Process emails
    const memberEmails = members
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email && /\S+@\S+\.\S+/.test(email)); // Basic email validation

    if (memberEmails.length === 0) {
      toast.error("Please enter at least one valid email address");
      setLoading(false);
      return;
    }

    // Validate all emails
    if (!memberEmails.every(email => /\S+@\S+\.\S+/.test(email))) {
      toast.error("Please enter valid email addresses");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
   
    try {
      const groupResponse = await axios.post(
        " https://educrew-2.onrender.com/api/groups/create",
        { 
          name: groupName,
          memberEmails: memberEmails // Match the parameter name expected by backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Extract groupId from the response based on the new response structure
      const groupId = groupResponse.data.data._id;
      
      toast.success("Group created successfully!");
      navigate(`/dashboard/group/${groupId}`);
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error.response?.data?.error || "Error creating group. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4 py-8">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
          Create New Group
        </h2>
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Group Name
            </label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Member Emails
            </label>
            <textarea
              placeholder="Enter member emails, separated by commas"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 min-h-[100px]"
            />
            <p className="text-xs text-gray-400 mt-2">
              Separate multiple emails with commas
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? "Creating Group..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;