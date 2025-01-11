'use client'

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useSearchParams } from 'react-router-dom';
import CustomCalendar from './calender';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        let fetchedTasks = [];

        // Try to fetch from API first
        try {
          let response;
          if (taskId) {
            response = await axios.get(`${BASE_URL}/tasks/${taskId}`);
            fetchedTasks = [response.data];
          } else if (groupId) {
            response = await axios.get(`${BASE_URL}/tasks/group/${groupId}`);
            fetchedTasks = response.data;
          } else {
            response = await axios.get(`${BASE_URL}/tasks`);
            fetchedTasks = response.data;
          }
        } catch (apiError) {
          console.error('API fetch failed:', apiError);
          // If API fetch fails, fall back to localStorage
          const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
          if (taskId) {
            fetchedTasks = storedTasks.filter(task => task._id === taskId);
          } else if (groupId) {
            fetchedTasks = storedTasks.filter(task => task.groupId === groupId);
          } else {
            fetchedTasks = storedTasks;
          }
          toast.warning('Using locally stored tasks. Some data may not be up to date.');
        }

        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching task(s):', error);
        toast.error('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [taskId, groupId]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tasks');
    toast.success('Logged out successfully');
    window.location.href = '/sign-in';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="text-white text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <ToastContainer />
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Task Calendar</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <CustomCalendar tasks={tasks.map(task => ({
            id: task._id,
            title: `${task.taskName} (${task.subtasks?.length || 0} subtasks)`,
            start: new Date(task.deadline),
            end: new Date(task.deadline),
            description: task.subtasks?.map(st => st.name).join(', ') || 'No subtasks',
            groupId: task.groupId,
            groupName: task.groupName
          }))} />
        </div>
      </div>
    </div>
  );
}

