import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const CustomCalendar = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Convert tasks to events
    const taskEvents = tasks.map(task => ({
      id: task._id,
      title: `${task.groupName}: ${task.taskName}`,
      description: `Deadline for task: ${task.taskName} (Group: ${task.groupName})`,
      date: new Date(task.deadline),
      color: '#EC4899', // You can assign different colors based on task type or status
      isBookmarked: false
    }));
    setEvents(taskEvents);
  }, [tasks]);

  // Calendar navigation functions
  const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const addYears = (date, years) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  };

  // Get calendar data
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDate = (date) => {
    return events.filter(event => 
      new Date(event.date).toDateString() === new Date(date).toDateString()
    );
  };

  const toggleBookmark = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isBookmarked: !event.isBookmarked }
        : event
    ));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-5 bg-gray-900/30 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, -1))}
                  className="p-1 hover:bg-gray-800 rounded text-gray-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-1 hover:bg-gray-800 rounded text-gray-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentDate(addYears(currentDate, -1))}
                className="px-3 py-1 hover:bg-gray-800 rounded text-sm text-gray-400"
              >
                Prev Year
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 rounded text-sm text-white"
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentDate(addYears(currentDate, 1))}
                className="px-3 py-1 hover:bg-gray-800 rounded text-sm text-gray-400"
              >
                Next Year
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => (
              <div key={day} className="text-center py-2 text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((day, index) => {
              const isSelected = day.date.toDateString() === selectedDate.toDateString();
              const dayEvents = getEventsForDate(day.date);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    min-h-24 p-1 rounded-lg text-sm relative cursor-pointer
                    ${day.isCurrentMonth ? 'text-white hover:bg-gray-800/50' : 'text-gray-600'}
                    ${isSelected ? 'ring-2 ring-fuchsia-500' : ''}
                    ${hasEvents ? '' : 'hover:bg-gray-800/50'}
                  `}
                  style={{
                    backgroundColor: hasEvents ? `${dayEvents[0].color}15` : '',
                  }}
                >
                  <span className="block p-1">{day.date.getDate()}</span>
                  <div className="space-y-1">
                    {dayEvents.map((event, i) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded truncate"
                        style={{ backgroundColor: `${event.color}30` }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Panel */}
        <div className="lg:col-span-2 bg-gray-900/30 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Events for {selectedDate.toDateString()}</h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getEventsForDate(selectedDate).map(event => (
              <div
                key={event.id}
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${event.color}20` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-gray-400">{event.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleBookmark(event.id)}
                    className="text-gray-400 hover:text-fuchsia-500"
                  >
                    <Star className={`w-4 h-4 ${event.isBookmarked ? 'fill-fuchsia-500 text-fuchsia-500' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
            {getEventsForDate(selectedDate).length === 0 && (
              <p className="text-center text-gray-500 py-4">No events for this date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;

