import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import { decodeToken } from '../../../utils/jwtUtils';
import { Users, Plus, Loader2, AlertCircle } from 'lucide-react';

const GroupPage = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserGroups();
    }, []);

    const fetchUserGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const decoded = decodeToken(token);
            if (!decoded || !decoded.userId) {
                throw new Error('Invalid token');
            }
            console.log('Decoded Token:', decoded);

            const response = await axiosInstance.get(`/groups/user/${decoded.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            
            setUserGroups(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError(err.response?.data?.message || 'Failed to fetch groups');
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-gray-600 font-medium">Loading your groups...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                    <h3 className="text-lg font-medium text-red-800">Error</h3>
                </div>
                <p className="mt-2 text-red-600">{error}</p>
                <button 
                    onClick={fetchUserGroups}
                    className="mt-4 w-full py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-200 font-medium"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            My Groups
                        </span>
                    </h2>
                    <Link 
                        to="/dashboard/group-form"
                        className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="font-medium">Create Group</span>
                    </Link>
                </div>
                
                {userGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userGroups.map((group) => (
                            <div 
                                key={group._id} 
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                                        {group.groupName}
                                    </h3>
                                    <p className="text-gray-500 mb-5 flex items-center">
                                        <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-xs font-bold">
                                            A
                                        </span>
                                        {group.adminEmail}
                                    </p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center text-gray-500">
                                            <Users className="w-5 h-5 mr-2 text-blue-500" />
                                            <span className="font-medium">
                                                {group.memberCount} {group.memberCount === 1 ? 'Member' : 'Members'}
                                            </span>
                                        </div>
                                        <Link 
                                            to={`/dashboard/group/${group._id}`}
                                            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="bg-blue-50 p-5 rounded-full mb-4">
                            <Users className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Groups Yet</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            You haven't joined any groups yet. Create your first group to collaborate with others.
                        </p>
                        <Link 
                            to="/dashboard/create-group"
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            <span className="font-medium">Create Your First Group</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupPage;