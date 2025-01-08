import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { groupId } = useParams(); // Assuming groupId is passed via route
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState(""); // State for user email
    const navigate = useNavigate();  // Hook to navigate between pages
  

  useEffect(() => {
    // Fetch the specific group by groupId
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token if required
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch group");
        }
        const data = await response.json();
        setGroup(data);

        // Fetch user details by userId (from group data)
        const fetchUser = async (userId) => {
          try {
            const userResponse = await fetch(`/api/user/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user details");
            }
            const userData = await userResponse.json();
            setUserEmail(userData.email); // Set the email in the state
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        };

        if (data.userId) {
          fetchUser(data.userId); // Fetch the user details when group data is fetched
        }
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };

    fetchGroup();
  }, [groupId]);

  // Fetch tasks for the group
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token if required
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const taskData = await response.json();
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (groupId) {
      fetchTasks();
    }
  }, [groupId]);

  if (!group) {
    return <p>Loading group details...</p>;
  }

  
  const handleUpdateClick = (groupId) => {
    navigate(`/dashboard/update-group/${groupId}`); // Navigate to the update group page
  };

  return (
    <div>
      <h1>Group Details</h1>
      <p>
        <strong>Group Name:</strong> {group.groupName}
      </p>
      <p>
        <strong>Group Creator Email:</strong> {userEmail}
      </p>{" "}
      {/* Display the user's email */}
      <p>
        <strong>Members:</strong> {group.members?.join(", ") || "No members"}
      </p>
      <h2>Tasks:</h2>
      {tasks?.map((task) => (
        <div key={task._id}>
          <p>
            <strong>Task Name:</strong> {task.taskName}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(task.deadline).toLocaleDateString()}
          </p>

          <h3>Subtasks:</h3>
          {task.subtasks?.length > 0 ? (
            <ul>
              {task.subtasks.map((subtask, index) => (
                <li key={index}>
                  <p>
                    <strong>Subtask Name:</strong> {subtask.name}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {subtask.completed ? "Completed" : "Not Completed"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No subtasks available</p>
          )}
        </div>
      ))}
      <button
        onClick={() => handleUpdateClick(group._id)}
        style={{ marginLeft: "10px", color: "blue" }}
      >
        update 
      </button>
    </div>
  );
};

export default Dashboard;
