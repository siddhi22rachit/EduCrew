import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import Dashboard from "./pages/dashboard/landingPage";
import GroupView from "./pages/dashboard/group";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import CalendarPage from "./pages/dashboard/calender";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard routes nested under layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Index route for dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Dashboard sub-routes */}
          <Route path="group" element={<GroupView />} />
          <Route path="chat" element={<div>Chat Page</div>} />
          <Route path="notes" element={<div>Notes Page</div>} />
          <Route path="tasks" element={<div>Tasks Page</div>} />
          <Route path="calendar" element={<CalendarPage/>} />
          <Route path="calls" element={<div>Video Calls Page</div>} />
          <Route path="resources" element={<div>Resources Page</div>} />
        </Route>

        {/* Catch-all route for 404 - place it last */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}