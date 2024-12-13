'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import CustomCalendar from './calender';

const BASE_URL = 'http://localhost:5000/api';

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useParams();
  const taskId = searchParams.get('taskId');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        if (taskId) {
          const response = await axios.get(`${BASE_URL}/tasks/${taskId}`);
          if (response.data) {
            setTasks([response.data]);
          } else {
            throw new Error('Invalid data format received from the server');
          }
        } else {
          const response = await axios.get(`${BASE_URL}/tasks`);
          if (response.data && Array.isArray(response.data)) {
            setTasks(response.data);
          } else {
            throw new Error('Invalid data format received from the server');
          }
        }
      } catch (error) {
        console.error('Error fetching task(s):', error);
        toast.error('Failed to load task(s). Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="text-white text-xl">Loading task(s)...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <ToastContainer />
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Task Calendar</h1>
        <div className="bg-gray-800 rounded-xl p-6">
          <CustomCalendar tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

