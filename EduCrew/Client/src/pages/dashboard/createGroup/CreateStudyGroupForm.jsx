import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Loader2, Mail, Users } from "lucide-react";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const addEmail = () => {
    const trimmedEmail = members.trim();
    if (trimmedEmail && validateEmail(trimmedEmail) && !emailList.includes(trimmedEmail)) {
      setEmailList([...emailList, trimmedEmail]);
      setMembers("");
    } else if (trimmedEmail) {
      setMessage("Please enter a valid email address");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmailList(emailList.filter(email => email !== emailToRemove));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    // Validate group name and emails
    if (!groupName.trim()) {
      setMessage("Please enter a group name");
      return;
    }

    // Validate email list if not empty
    const invalidEmails = emailList.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
      setMessage("Please remove invalid email addresses");
      return;
    }

    setLoading(true);
    setMessage("");
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      setMessage("No token found. Please log in again.");
      setLoading(false);
      return;
    }
  
    try {
      // Step 1: Create the group with only the admin
      const groupResponse = await axios.post(
        "http://localhost:5000/api/groups/create",
        { name: groupName }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      const groupId = groupResponse.data._id; 
  
      // Step 2: Invite members if any are provided
      if (emailList.length > 0) {
        const inviteResponse = await axios.post(
          `http://localhost:5000/api/groups/${groupId}/invite`,
          { emails: emailList },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
  
        setMessage("Group created and invitations sent!");
      } else {
        setMessage("Group created successfully!");
      }

      navigate(`/dashboard/group/${groupId}`);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating group. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Centered Title */}
        <div className="text-center bg-gray-700/50 py-6 border-b border-gray-600">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Create Group
          </h2>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Form Section */}
          <div className="w-full md:w-1/2 p-8 space-y-6">
            <div>
              <label className="flex items-center text-blue-300 mb-2 font-semibold">
                <Mail className="mr-2" size={20} />
                Group Name
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-blue-300 mb-2 font-semibold">
                <Users className="mr-2" size={20} />
                Member Emails
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={members}
                  onChange={(e) => {
                    setMembers(e.target.value);
                    setMessage(""); // Clear any previous error messages
                  }}
                  className="flex-grow p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <button
                  type="button"
                  onClick={addEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors duration-300"
                >
                  Add
                </button>
              </div>
              {message && message.includes("email") && (
                <p className="text-red-400 text-sm mt-1">{message}</p>
              )}
            </div>
          </div>

          {/* Right Side - Email List Section */}
          <div className="w-full md:w-1/2 p-8 bg-gray-700/50 space-y-4">
            <h3 className="text-xl font-semibold text-blue-300 flex items-center">
              <Users className="mr-2" size={20} />
              Invited Members
            </h3>
            {emailList.length === 0 ? (
              <p className="text-gray-400">No members added yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {emailList.map((email) => (
                  <div 
                    key={email} 
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-xl"
                  >
                    <span className="text-white truncate flex-grow mr-2">{email}</span>
                    <button 
                      onClick={() => removeEmail(email)}
                      className="text-red-500 hover:bg-red-900/20 rounded-full p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Centered Create Group Button */}
        <div className="text-center py-6 bg-gray-700/50 border-t border-gray-600">
          <button
            type="submit"
            onClick={handleCreateGroup}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-12 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 animate-spin" /> Creating...</>
            ) : (
              "Create Group"
            )}
          </button>
        </div>

        {/* Message Display */}
        {message && !message.includes("email") && (
          <div className="text-center py-4">
            <p className={`${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;