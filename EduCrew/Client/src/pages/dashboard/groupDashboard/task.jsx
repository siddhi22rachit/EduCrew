import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const TaskBox = ({ groupId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80">
      <div className="flex items-center mb-4">
        <CheckCircle2 className="text-blue-500 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
      </div>
      <div className="space-y-2">
        {/* Placeholder for tasks */}
        <p className="text-gray-500 text-center">No tasks available</p>
      </div>
    </div>
  );
};

export default TaskBox;