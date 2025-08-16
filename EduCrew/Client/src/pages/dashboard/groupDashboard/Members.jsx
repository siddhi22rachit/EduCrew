import React, { useState, useEffect } from 'react';
import { Users, Crown, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const MembersBox = ({ groupId, members, admin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [membersList, setMembersList] = useState(members || []);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Effect 1: Handle invitation from URL if logged in
  useEffect(() => {
    const action = searchParams.get('action');
    const email = searchParams.get('email');
    const token = localStorage.getItem('token');

    if (action && email) {
      if (!token) {
        localStorage.setItem(
          'pendingInvitation',
          JSON.stringify({ groupId, email, action })
        );
        navigate('/login');
      } else {
        handleInvitationResponse(action, email);
        navigate(`/dashboard/group/${groupId}`, { replace: true });
      }
    }
  }, []);

  // Effect 2: After login, check if invitation was pending
  useEffect(() => {
    const token = localStorage.getItem('token');
    const pending = localStorage.getItem('pendingInvitation');

    if (token && pending) {
      const { groupId: storedGroupId, email, action } = JSON.parse(pending);
      if (storedGroupId === groupId) {
        handleInvitationResponse(action, email);
        localStorage.removeItem('pendingInvitation');
        navigate(`/dashboard/group/${groupId}`, { replace: true });
      }
    }
  }, []);

  const handleInvitationResponse = async (action, email) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatusMessage('Authentication required');
        return;
      }

      if (action === 'accept') {
        const response = await axios.post(
          ` https://educrew-2.onrender.com/api/groups/${groupId}/accept`,
          { email },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const updatedGroup = response.data.group;
        setMembersList(updatedGroup.members || []);
        setStatusMessage('Invitation accepted successfully');
      }
    } catch (error) {
      console.error('Error processing invitation:', error);
      setStatusMessage('Something went wrong');
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const filteredMembers =
    membersList?.filter((member) => {
      if (member.user && admin && member.user._id === admin._id) {
        return false;
      }
      return true;
    }) || [];

  return (
    <div className="bg-[#0A1128] rounded-lg shadow-md p-6 h-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="text-blue-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-blue-400">Members</h2>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mb-3 text-sm py-2 px-3 rounded ${
            statusMessage.includes('wrong')
              ? 'bg-red-600/20 text-red-400'
              : 'bg-green-600/20 text-green-400'
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="space-y-2 overflow-y-auto h-[calc(100%-80px)]">
        {admin && (
          <div className="flex items-center justify-between mb-2 p-2 bg-[#162955] rounded">
            <div className="flex items-center">
              <span className="font-medium mr-2 text-white">Admin:</span>
              <span className="text-white">
                {admin.email || 'Unknown Admin'}
              </span>
            </div>
            <Crown className="text-yellow-400" size={20} />
          </div>
        )}

        {filteredMembers.length > 0 ? (
          filteredMembers.map((member, index) => {
            const email = member.user?.email || member.email;
            const isAccepted = member.accepted;

            return (
              <div
                key={member._id || `member-${index}`}
                className="flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0 hover:bg-[#162955] transition"
              >
                <span className={isAccepted ? 'text-white' : 'text-gray-400'}>
                  {email || 'Unknown User'}
                </span>

                {isAccepted ? (
                  <CheckCircle className="text-green-400" size={20} />
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
