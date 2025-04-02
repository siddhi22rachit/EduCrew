import React, { useState } from 'react';
import { Plus, Folder, Trash2, FileText } from 'lucide-react';

const ResourceBox = ({ groupId }) => {
  const [resources, setResources] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newResource = {
        id: Date.now(),
        title: file.name,
        file: file,
        preview: URL.createObjectURL(file)
      };

      setResources(prevResources => [...prevResources, newResource]);
    }
  };

  const handleFileDelete = (resourceToDelete) => {
    URL.revokeObjectURL(resourceToDelete.preview);

    setResources(prevResources => 
      prevResources.filter(resource => resource.id !== resourceToDelete.id)
    );
  };

  const handleOpenFile = (resource) => {
    // Open file in a new browser tab or window
    const fileURL = URL.createObjectURL(resource.file);
    window.open(fileURL, '_blank');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const newResource = {
        id: Date.now(),
        title: file.name,
        file: file,
        preview: URL.createObjectURL(file)
      };

      setResources(prevResources => [...prevResources, newResource]);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconProps = { size: 48, className: "mx-auto text-blue-500" };

    switch (extension) {
      case 'pdf':
        return <FileText {...iconProps} />;
      case 'doc':
      case 'docx':
        return <FileText {...iconProps} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <img 
          src={URL.createObjectURL(resources.find(r => r.title === fileName).file)} 
          alt="Preview" 
          className="mx-auto h-12 w-12 object-cover rounded"
        />;
      default:
        return <Folder {...iconProps} />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl p-6 h-80 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Folder className="text-blue-400 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-blue-200">Resources</h2>
        </div>
        <input 
          type="file" 
          id="fileInput" 
          className="hidden" 
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => document.getElementById('fileInput').click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center"
        >
          <Plus className="mr-1" size={16} />
          Add Files
        </button>
      </div>
      
      {resources.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[200px]">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className="relative bg-gray-800 rounded-lg p-3 text-center group cursor-pointer"
              onClick={() => handleOpenFile(resource)}
            >
              {getFileIcon(resource.title)}
              <p className="text-sm text-gray-300 mt-2 truncate">{resource.title}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileDelete(resource);
                }}
                className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-600'} 
            rounded-lg h-48 flex flex-col items-center justify-center text-center 
            hover:bg-gray-800 transition-colors cursor-pointer`}
          onClick={() => document.getElementById('fileInput').click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Plus className="text-blue-400 mb-2" size={48} />
          <p className="text-gray-400 mb-1">Add Your Knowledge Here</p>
          <p className="text-sm text-gray-600">
            Click or drag and drop files to upload
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceBox;