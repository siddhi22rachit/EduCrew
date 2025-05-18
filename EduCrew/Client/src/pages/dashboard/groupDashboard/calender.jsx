import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

// Custom stylesheet to override react-big-calendar defaults
// This would be in a separate CSS file that you'd import
const calendarStyles = `
  /* Override calendar styles for dark theme */
  .rbc-calendar {
    background-color: black;
    color: #e0e7ff;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .rbc-toolbar {
    background-color: rgba(30, 58, 138, 0.2);
    color: #93c5fd;
    border-bottom: 1px solid rgba(37, 99, 235, 0.3);
    padding: 15px;
  }
  
  .rbc-toolbar button {
    color: #93c5fd;
    background-color: rgba(30, 58, 138, 0.4);
    border: 1px solid rgba(37, 99, 235, 0.5);
    border-radius: 0.375rem;
    padding: 5px 15px;
  }
  
  .rbc-toolbar button:hover {
    background-color: rgba(37, 99, 235, 0.5);
    border-color: rgba(37, 99, 235, 0.7);
  }
  
  .rbc-toolbar button.rbc-active {
    background-color: rgba(37, 99, 235, 0.7);
    border-color: #3b82f6;
    color: white;
  }
  
  .rbc-month-view, .rbc-agenda-view, .rbc-time-view {
    background-color: black;
    border: 1px solid rgba(37, 99, 235, 0.3);
  }
  
  .rbc-month-row, .rbc-time-header, .rbc-agenda-view table.rbc-agenda-table {
    border-color: rgba(37, 99, 235, 0.3);
  }
  
  .rbc-day-bg, .rbc-header {
    background-color: rgba(15, 23, 42, 0.3);
    border-color: rgba(37, 99, 235, 0.3);
  }
  
  .rbc-day-bg + .rbc-day-bg, .rbc-header + .rbc-header {
    border-color: rgba(37, 99, 235, 0.3);
  }
  
  .rbc-header {
    color: #93c5fd;
    font-weight: 500;
    padding: 10px 0;
  }
  
  .rbc-date-cell {
    color: #e0e7ff;
    padding: 5px 10px;
    text-align: center;
  }
  
  .rbc-off-range-bg {
    background-color: rgba(15, 23, 42, 0.5);
  }
  
  .rbc-off-range {
    color: #64748b;
  }
  
  .rbc-today {
    background-color: rgba(37, 99, 235, 0.2);
  }
  
  .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
    background-color: rgba(30, 58, 138, 0.2);
    color: #93c5fd;
    border-color: rgba(37, 99, 235, 0.3);
  }
  
  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
    border-color: rgba(37, 99, 235, 0.3);
    color: #e0e7ff;
  }
  
  .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
    background-color: rgba(37, 99, 235, 0.2);
  }
  
  .rbc-time-header-content {
    border-color: rgba(37, 99, 235, 0.3);
  }
  
  .rbc-time-content {
    border-color: rgba(37, 99, 235, 0.3);
  }
  
  .rbc-time-slot {
    color: #93c5fd;
  }
  
  .rbc-current-time-indicator {
    background-color: #3b82f6;
  }
  
  /* Tooltip styles */
  .rbc-tooltip {
    background-color: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(37, 99, 235, 0.5);
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    color: #e0e7ff;
    padding: 8px 12px;
  }
`;

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const { authUser, logout, isUserValid } = useAuthStore()
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date())
  const [error, setError] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/sign-in');
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const response = await axios.get(`https://educrew-2.onrender.com/api/tasks/user/calendar`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Format tasks for the calendar
        const formattedTasks = response.data.tasks.map(task => ({
          id: task._id,
          title: `${task.title} (${task.groupName})`,
          start: new Date(task.deadline),
          end: new Date(task.deadline),
          groupId: task.groupId,
          groupName: task.groupName,
          subtasks: task.subtasks
        }));
        
        setTasks(formattedTasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks for calendar:', error);
        setError('Failed to load your tasks. Please try again later.');
        setLoading(false);
      }
    };

    fetchTasks();

    // Background animation shapes
    const newShapes = Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i,
        width: Math.floor(Math.random() * 500 + 300),
        height: Math.floor(Math.random() * 500 + 300),
        left: Math.floor(Math.random() * 100),
        top: Math.floor(Math.random() * 100),
        delay: i * 1.5,
        duration: Math.floor(Math.random() * 15 + 15),
        opacity: Math.random() * 0.04 + 0.02,
      }));
    setShapes(newShapes);
  }, []);

  const eventStyleGetter = (event) => {
    // Generate a consistent color based on groupId
    const colors = [
      'rgba(59, 130, 246, 0.9)',  // blue
      'rgba(16, 185, 129, 0.9)',  // green
      'rgba(245, 158, 11, 0.9)',  // yellow
      'rgba(239, 68, 68, 0.9)',   // red
      'rgba(139, 92, 246, 0.9)',  // purple
      'rgba(236, 72, 153, 0.9)',  // pink
      'rgba(79, 70, 229, 0.9)',   // indigo
      'rgba(20, 184, 166, 0.9)',  // teal
      'rgba(249, 115, 22, 0.9)'   // orange
    ];
    
    // Use groupId to determine color (consistently)
    const colorIndex = event.groupId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return {
      style: {
        backgroundColor: colors[colorIndex],
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        padding: '4px 8px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    };
  };

  const handleSelectEvent = (event) => {
    // Navigate to task detail page
    window.location.href = `/dashboard/group/${event.groupId}/task/${event.id}`;
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };
  const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-black text-red-400 min-h-screen flex items-center justify-center">
        <div className="max-w-md px-6 py-8 bg-slate-900/50 rounded-xl border border-red-500/30 shadow-lg">
          <p className="mb-4">{error}</p>
          <button 
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-blue-50 flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-black">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full mix-blend-screen filter blur-3xl"
            style={{
              background: shape.id % 3 === 0 
                ? "rgba(59, 130, 246, 0.07)" 
                : shape.id % 3 === 1 
                  ? "rgba(14, 165, 233, 0.05)" 
                  : "rgba(6, 182, 212, 0.03)",
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
              opacity: shape.opacity,
              animation: "pulse 15s infinite ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10 w-full">
        {/* Header */}
        <header className="h-16 border-b border-blue-900/40 flex items-center justify-between px-6 bg-black shadow-lg shadow-blue-900/5">
          <div className="flex items-center">
            
            <h1 className="text-xl font-semibold text-blue-100">Task Calender</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-blue-200 hidden md:block">{formattedTime}</div>
            <div className="relative">
              <button
                className="flex items-center gap-3 hover:bg-blue-800/20 p-2 px-3 rounded-full transition-all duration-300"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src={authUser.profilePic || "/placeholder.svg?height=32&width=32"}
                  alt={authUser.fullName}
                  className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-md shadow-blue-500/20 object-contain"
                />
                <span className="text-sm font-medium text-blue-100">{authUser.fullName}</span>
                <ChevronDown className="w-4 h-4 text-blue-300" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-blue-900/50 rounded-lg shadow-xl py-1 shadow-blue-900/20 z-50">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/30 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/30 transition-colors"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-950/40 to-black rounded-xl p-6 mb-6 overflow-hidden border border-blue-900/30 shadow-lg shadow-blue-900/5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 blur-3xl scale-150 opacity-30 transition-opacity duration-500" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">Task Calendar</h2>
                  <p className="text-blue-300 text-sm md:text-base">View all your tasks from all groups in one calendar</p>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <button 
                    className={`px-4 py-2 text-sm border border-blue-800/50 rounded-l-lg transition-all duration-300 ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
                    onClick={() => handleViewChange('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm border-t border-b border-r border-blue-800/50 transition-all duration-300 ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
                    onClick={() => handleViewChange('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm border-t border-b border-r border-blue-800/50 transition-all duration-300 ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
                    onClick={() => handleViewChange('day')}
                  >
                    Day
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm border-t border-b border-r border-blue-800/50 rounded-r-lg transition-all duration-300 ${view === 'agenda' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
                    onClick={() => handleViewChange('agenda')}
                  >
                    Agenda
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-gradient-to-b from-blue-950/20 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/5 overflow-hidden">
              <style>
                {calendarStyles}
              </style>
              <div style={{ height: '75vh' }}>
                <Calendar
                  localizer={localizer}
                  events={tasks}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  views={['month', 'week', 'day', 'agenda']}
                  view={view}
                  onView={handleViewChange}
                  date={date}
                  onNavigate={handleNavigate}
                  popup
                  tooltipAccessor={(event) => `${event.title}\nGroup: ${event.groupName}\nDeadline: ${moment(event.start).format('MMM DD, YYYY')}`}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-blue-950/20 rounded-xl border border-blue-900/30 p-4">
              <h3 className="text-lg font-medium text-blue-100 mb-3">Groups</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...new Set(tasks.map(task => task.groupName))].map((groupName, index) => {
                  const groupTasks = tasks.filter(task => task.groupName === groupName);
                  const groupId = groupTasks[0]?.groupId || '0';
                  const colorIndex = groupId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9;
                  
                  const colors = [
                    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                    'bg-red-500', 'bg-purple-500', 'bg-pink-500',
                    'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
                  ];
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[colorIndex]}`}></div>
                      <span className="text-sm text-blue-200 truncate">{groupName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskCalendar;
