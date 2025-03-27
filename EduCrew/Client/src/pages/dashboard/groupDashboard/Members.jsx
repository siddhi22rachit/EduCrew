import React from 'react';
import { Users, Crown, CheckCircle, Clock } from 'lucide-react';

const MembersBox = ({ groupId, members, admin }) => {
  // Remove the first member from the list
  const filteredMembers = members ? members.slice(1) : [];

  return (
    <div className="bg-[#0A1128] rounded-lg shadow-md p-6 h-80">
      <div className="flex items-center mb-4">
        <Users className="text-blue-500 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-blue-400">Members</h2>
      </div>
      <div className="space-y-2 h-[250px]">
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
            const user = member?.user || {};
            const isAccepted = member.accepted;

            return (
              <div 
                key={member._id || index} 
                className="flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0 hover:bg-[#162955] transition"
              >
                <span className={`${isAccepted ? 'text-white' : 'text-gray-500'}`}>
                  {user?.email ? user.email : "Unknown User"}
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