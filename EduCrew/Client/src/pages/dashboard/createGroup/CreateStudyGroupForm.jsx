import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios'; // Update this path

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (members.includes(email)) {
      setError('This email is already added');
      return;
    }

    setMembers([...members, email]);
    setEmail('');
    setError('');
  };

  const handleRemoveMember = (emailToRemove) => {
    setMembers(members.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (members.length === 0) {
      setError('Please add at least one member');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data } = await axiosInstance.post('/groups', {
        groupName: groupName.trim(),
        members,
        totalMembers: members.length + 1
      });

      navigate(`/dashboard/task/${data.group._id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 text-gray-100">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500 opacity-10 blur-xl rounded-xl"></div>
        <h2 className="relative text-3xl font-bold mb-8 text-purple-400">Create New Group</h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded-lg border border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="groupName" className="block text-purple-300 font-medium mb-2">
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-gray-100 placeholder-gray-500 transition duration-200"
            placeholder="Enter group name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-purple-300 font-medium mb-2">
            Add Member
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-gray-100 placeholder-gray-500 transition duration-200"
              placeholder="Enter member's email"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition duration-200 shadow-lg shadow-purple-500/30"
            >
              Add
            </button>
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <h3 className="text-purple-300 font-medium mb-3">Members:</h3>
            <div className="space-y-3">
              {members.map((memberEmail) => (
                <div 
                  key={memberEmail}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm"
                >
                  <span className="text-gray-200">{memberEmail}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(memberEmail)}
                    className="text-red-400 hover:text-red-300 transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium shadow-lg transition duration-200 mt-6
            ${loading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'}`}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;