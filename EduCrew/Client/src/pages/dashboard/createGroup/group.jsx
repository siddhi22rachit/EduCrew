import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/groups", {
          withCredentials: true,
        });
        setGroups(response.data.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
      setLoading(false);
    };

    fetchGroups();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">My Groups</h2>
      {loading ? (
        <p>Loading...</p>
      ) : groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        groups.map((group) => (
          <div key={group._id} className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-bold">{group.name}</h3>
            <ul className="mt-2">
              {group.members.map((member) => (
                <li
                  key={member.user}
                  className={`text-sm ${
                    member.accepted ? "text-white" : "text-gray-400"
                  }`}
                >
                  {member.user.name} ({member.accepted ? "Accepted" : "Pending"})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
