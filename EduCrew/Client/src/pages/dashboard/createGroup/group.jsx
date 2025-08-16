import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { groupId } = useParams(); // Get groupId from URL
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
        // console.log("🔹 Fetching Group Details for:", groupId);

        const response = await axios.get(` https://educrew-2.onrender.com/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // console.log("🚀 Full Group Response Data:", response.data);

        if (response.data?.data) {
          setGroup(response.data.data);
        } else {
          console.error("❌ Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching group details:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (loading) return <p>Loading...</p>;
  if (!group) return <p>Group not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{group.name || "Unnamed Group"}</h2>
      <p className="text-gray-400">
        <strong>Admin:</strong> {group?.admin?.email || "Unknown"}
      </p>

      <h3 className="mt-4 text-lg font-semibold">Members</h3>
      <ul className="list-disc pl-5">
        {group?.members && group.members.length > 0 ? (
          group.members.map((member, index) => {
            const user = member?.user || {}; // Handle cases where `user` is missing
            return (
              <li key={member._id}>
                {user?.email ? user.email : "Unknown User"} 
              </li>
            );
          })
        ) : (
          <p>No members found.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
