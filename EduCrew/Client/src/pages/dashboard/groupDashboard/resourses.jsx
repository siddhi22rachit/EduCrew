import React, { useState, useEffect } from 'react';
import { Plus, Folder, Trash2, FileText, Loader, File, Image, Film, Music, Archive, Table,  Download, ImageIcon } from 'lucide-react';
import axios from 'axios';

const ResourceBox = ({ groupId }) => {
  const [resources, setResources] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing resources when component mounts
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/resources/${groupId}`);
        setResources(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources');
        setIsLoading(false);
      }
    };

    if (groupId) {
      fetchResources();
    }
  }, [groupId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadToServer(file);
    }
  };

  const uploadToServer = async (file) => {
    try {
      setIsLoading(true);
      
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      
      // Upload to server
      const response = await axios.post(
        `/api/resources/${groupId}/add`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Add the new resource to state
      const newResource = response.data.data;
      setResources(prevResources => [...prevResources, newResource]);
      setIsLoading(false);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file: ' + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  const handleFileDelete = async (resourceId) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/resources/${resourceId}`);
      
      // Remove from UI
      setResources(prevResources => 
        prevResources.filter(resource => resource._id !== resourceId)
      );
      setIsLoading(false);
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Failed to delete resource: ' + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  const handleDownloadFile = (e, resource) => {
    e.stopPropagation(); // Prevent opening the file in a new tab
    
    // Use the download endpoint to get the file with the correct name
    window.open(`/api/resources/${resource._id}/download`, '_blank');
  };

  const handleOpenFile = (resource) => {
    // Open the file URL in a new tab for viewing
    window.open(resource.fileUrl, '_blank');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadToServer(file);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (resource) => {
    const iconProps = { size: 48, className: "mx-auto text-blue-500" };
    
    // Use fileType property to determine icon
    switch (resource.fileType) {
      case 'image':
        // For images, show thumbnail
        return <img 
          src={resource.fileUrl} 
          alt="Preview" 
          className="mx-auto h-12 w-12 object-cover rounded"
        />;
      case 'document':
        return <FileText {...iconProps} />;
      case 'spreadsheet':
        return <Table {...iconProps} />;
      case 'presentation':
        return <ImageIcon {...iconProps} />;
      case 'archive':
        return <Archive {...iconProps} />;
      case 'audio':
        return <Music {...iconProps} />;
      case 'video':
        return <Film {...iconProps} />;
      default:
        return <File {...iconProps} />;
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-2xl p-6">
        <div className="text-red-400 mb-4">{error}</div>
        <button 
          onClick={clearError}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

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
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin mr-1" size={16} />
          ) : (
            <Plus className="mr-1" size={16} />
          )}
          Add Files
        </button>
      </div>
      
      {resources.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[200px]">
          {resources.map((resource) => (
            <div 
              key={resource._id} 
              className="relative bg-gray-800 rounded-lg p-3 text-center group cursor-pointer"
              onClick={() => handleOpenFile(resource)}
            >
              {getFileIcon(resource)}
              <p className="text-sm text-gray-300 mt-2 truncate">{resource.title}</p>
              <p className="text-xs text-gray-500">{formatFileSize(resource.fileSize)}</p>
              
              <div className="absolute top-1 right-1 flex space-x-1">
                <button 
                  onClick={(e) => handleDownloadFile(e, resource)}
                  className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Download"
                  disabled={isLoading}
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDelete(resource._id);
                  }}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
          {isLoading ? (
            <Loader className="text-blue-400 mb-2 animate-spin" size={48} />
          ) : (
            <>
              <Plus className="text-blue-400 mb-2" size={48} />
              <p className="text-gray-400 mb-1">Add Your Knowledge Here</p>
              <p className="text-sm text-gray-600">
                Click or drag and drop files to upload
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceBox;