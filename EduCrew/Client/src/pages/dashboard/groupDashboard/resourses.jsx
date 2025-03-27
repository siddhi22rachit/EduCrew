import React from 'react';
import { Folder } from 'lucide-react';

const ResourceBox = ({ groupId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80">
      <div className="flex items-center mb-4">
        <Folder className="text-purple-500 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Resources</h2>
      </div>
      <div className="space-y-2">
        {/* Placeholder for resources */}
        <p className="text-gray-500 text-center">No resources available</p>
      </div>
    </div>
  );
};

export default ResourceBox;