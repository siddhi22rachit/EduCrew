import { useState } from "react";
import axios from "axios";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handleCreateGroup = async () => {
    const token = localStorage.getItem("token"); // Retrieve token
  
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/groups/create",
        { name: "New Study Group", members: ["user1@example.com"] },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include cookies (if needed)
        }
      );
  
      console.log("Group created:", response.data);
    } catch (error) {
      console.error("Error creating group:", error.response?.data || error.message);
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
