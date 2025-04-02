import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressBox = ({ groupId, members }) => {
  // Function to get initials before @ in email
  const getInitials = (email) => {
    if (!email) return 'UN';
    return email.split('@')[0];
  };

  return (
    <div className="bg-[#0A1128] rounded-lg shadow-md p-6 h-80">
      <div className="flex items-center mb-4">
        <TrendingUp className="text-blue-500 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-blue-400">Progress</h2>
      </div>
      <div className="space-y-4">
        {members && members.length > 0 ? (
          members.map((member, index) => {
            const user = member?.user || {};
            const initials = getInitials(user.email);

            return (
              <div key={member._id || index} className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm">{initials}</span>
                  <span className="text-gray-400 text-xs">0%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: '0%' }}
                  ></div>
                </div>
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

export default ProgressBox;