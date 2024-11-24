import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateStudyGroupForm = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    members: [],
    totalMembers: 1 // Default to 1 (creator)
  });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle member addition
  const handleAddMember = (email) => {
    if (email && !formData.members.includes(email)) {
      setFormData(prevState => ({
        ...prevState,
        members: [...prevState.members, email],
        totalMembers: prevState.members.length + 2 // +2 to include creator
      }));
    }
  };

  // Handle member removal
  const handleRemoveMember = (email) => {
    setFormData(prevState => ({
      ...prevState,
      members: prevState.members.filter(member => member !== email),
      totalMembers: prevState.members.length
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.groupName.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      // Prepare the request payload
      const payload = {
        groupName: formData.groupName.trim(),
        members: formData.members,
        totalMembers: formData.totalMembers
      };

      // Send POST request to create group
      const response = await axios.post('http://localhost:5000/api/groups', payload);
      
      if (response.status === 201) {
        toast.success('Group created successfully!');
        
        // Navigate to tasks page for the new group
        navigate(`/dashboard/tasks/${response.data.group._id}`);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || 'Failed to create group');
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Error creating group. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Create Study Group
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name Input */}
          <div>
            <label 
              htmlFor="groupName" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              placeholder="Enter group name"
              className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
              required
            />
          </div>

          {/* Members Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add Members
            </label>
            <div className="flex">
              <input
                type="email"
                placeholder="Member email"
                className="flex-grow bg-gray-700 rounded-l-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                type="button"
                className="bg-purple-500 text-white px-4 rounded-r-lg hover:bg-purple-600"
                onClick={(e) => {
                  const emailInput = e.target.previousSibling;
                  handleAddMember(emailInput.value);
                  emailInput.value = '';
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Added Members List */}
          {formData.members.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Added Members
              </h3>
              <div className="space-y-2">
                {formData.members.map((email, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center bg-gray-600 rounded p-2"
                  >
                    <span className="text-white">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(email)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Members Display */}
          <div className="text-gray-300 text-sm">
            Total Members: {formData.totalMembers}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudyGroupForm;