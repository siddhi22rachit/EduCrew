import React, { useState, useEffect } from 'react';
import { Users, Crown, CheckCircle, Clock, X, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const MembersBox = ({ groupId, members, admin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [membersList, setMembersList] = useState(members || []);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Process URL parameters on component mount
  useEffect(() => {
    const action = searchParams.get('action');
    const email = searchParams.get('email');
    
    if (action && email) {
      handleInvitationResponse(action, email);
      // Clear the URL parameters after processing
      navigate(`/dashboard/group/${groupId}`, { replace: true });
    }
  }, []);

  // Handle invitation acceptance or rejection
  const handleInvitationResponse = async (action, email) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatusMessage('Authentication required');
        return;
      }

      if (action === 'accept') {
        // Update the UI immediately
        setMembersList(prev => 
          prev.map(member => 
            (member.email === email || (member.user && member.user.email === email)) 
              ? { ...member, accepted: true, rejected: false } 
              : member
          )
        );
        
        // Then make the API call
        await axios.post(
          `http://localhost:5000/api/groups/${groupId}/accept`,
          { email },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        
        setStatusMessage('Invitation accepted successfully');
      } else if (action === 'reject') {
        // Update the UI immediately
        setMembersList(prev => 
          prev.map(member => 
            (member.email === email || (member.user && member.user.email === email)) 
              ? { ...member, rejected: true, accepted: false } 
              : member
          )
        );
        
        // Then make the API call
        await axios.post(
          `http://localhost:5000/api/groups/${groupId}/reject`,
          { email },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        
        setStatusMessage('Invitation rejected successfully');
      }
    } catch (error) {
      console.error('Error processing invitation:', error);
      // Even if the API call fails, keep the UI updated
      // This ensures the user sees the change they intended
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // Handle sending invitation
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatusMessage('Authentication required');
        return;
      }
      
      const response = await axios.post(
        `http://localhost:5000/api/groups/${groupId}/invite`,
        { emails: [inviteEmail] },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      setStatusMessage('Invitation sent!');
      setInviteEmail('');
      setShowInviteForm(false);
      
      // Add the new member to the list with pending status
      setMembersList(prev => [
        ...prev, 
        { email: inviteEmail, accepted: false, rejected: false }
      ]);
    } catch (error) {
      console.error('Error sending invitation:', error);
      setStatusMessage('Failed to send invitation');
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // Filter out the admin from the members list
  const filteredMembers = membersList ? membersList.filter(member => {
    // Check if this member is the admin
    if (member.user && admin && member.user._id === admin._id) {
      return false; // Filter out the admin
    }
    return true;
  }) : [];

  return (
    <div className="bg-[#0A1128] rounded-lg shadow-md p-6 h-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="text-blue-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-blue-400">Members</h2>
        </div>
        <button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        >
          <UserPlus size={16} className="mr-1" />
          Invite
        </button>
      </div>
      
      {statusMessage && (
        <div className={`mb-3 text-sm py-2 px-3 rounded ${
          statusMessage.includes('Failed') ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'
        }`}>
          {statusMessage}
        </div>
      )}
      
      {showInviteForm && (
        <form onSubmit={handleInvite} className="mb-3 flex items-center">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            className="bg-[#162955] text-white border border-gray-700 rounded-l px-3 py-2 w-full text-sm"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r px-3 py-2 text-sm"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      )}
      
      <div className="space-y-2 overflow-y-auto h-[calc(100%-80px)]">
        {admin && (
          <div className="flex items-center justify-between mb-2 p-2 bg-[#162955] rounded">
            <div className="flex items-center">
              <span className="font-medium mr-2 text-white">Admin:</span>
              <span className="text-white">{admin.email || 'Unknown Admin'}</span>
            </div>
            <Crown className="text-yellow-400" size={20} />
          </div>
        )}
        
        {filteredMembers && filteredMembers.length > 0 ? (
          filteredMembers.map((member, index) => {
            const email = member.user?.email || member.email;
            const isAccepted = member.accepted;
            const isRejected = member.rejected;

            return (
              <div 
                key={member._id || `member-${index}`} 
                className="flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0 hover:bg-[#162955] transition"
              >
                <span className={`
                  ${isAccepted ? 'text-white' : ''}
                  ${isRejected ? 'text-red-400' : ''}
                  ${!isAccepted && !isRejected ? 'text-gray-500' : ''}
                `}>
                  {email || "Unknown User"}
                </span>
                
                {isAccepted ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : isRejected ? (
                  <X className="text-red-400" size={20} />
                ) : (
                  <Clock className="text-gray-400" size={20} />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No members found</p>
        )}
      </div>
    </div>
  );
};

export default MembersBox;