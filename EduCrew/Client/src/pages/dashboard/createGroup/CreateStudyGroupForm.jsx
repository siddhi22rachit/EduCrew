import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    const token = localStorage.getItem("token");
    console.log("🔹 Token from localStorage:", token);
  
    if (!token) {
      console.error("❌ No token found in localStorage");
      setMessage("No token found. Please log in again.");
      setLoading(false);
      return;
    }
  
    try {
      // Step 1: Create the group with only the admin
      const groupResponse = await axios.post(
        "http://localhost:5000/api/groups/create",
        { name: groupName }, // Only send group name
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      console.log("🚀 Group Created:", groupResponse.data);
      const groupId = groupResponse.data._id; // Extract group ID
  
      // Step 2: Invite members if any are provided
      if (members.trim()) {
        const emailsArray = members.split(",").map((email) => email.trim());
  
        const inviteResponse = await axios.post(
          `http://localhost:5000/api/groups/${groupId}/invite`,
          { emails: emailsArray },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
  
        console.log("📩 Invitation Response:", inviteResponse.data);
        setMessage("Group created and invitations sent!");
      } else {
        setMessage("Group created successfully!");
      }

      navigate(`./dashboard/group/${groupId}`);

    } catch (error) {
      console.error("❌ Error:", error);
      setMessage(error.response?.data?.message || "Error creating group. Try again!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Group</h2>
      <form onSubmit={handleCreateGroup} className="space-y-4">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          required
        />
        <textarea
          placeholder="Enter member emails, separated by commas"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
    </div>
  );
};

export default CreateGroup;
