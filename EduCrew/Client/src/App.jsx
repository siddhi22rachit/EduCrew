import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import Dashboard from "./pages/dashboard/landingPage";
import GroupView from "./pages/dashboard/groupView";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ResourcesPage from "./pages/dashboard/resources";
import LoginPage from "./pages/login/login";
import SignupPage from "./pages/login/SignUp";
import Profile from "./pages/profile/profile";
import CreateStudyGroupForm from "./pages/dashboard/createGroup/CreateStudyGroupForm";
import TaskPage from "./pages/dashboard/createGroup/task";
import ChatPage from "./pages/dashboard/chat";
import VideoCall from "./pages/dashboard/Video_call/videoCall";
import RoomPage from "./pages/dashboard/Video_call/Room";
import CalendarPage from "./pages/dashboard/calender";
import UpdateGroup from "./pages/dashboard/createGroup/UpdateGroup";
import Layout from "./pages/dashboard/groupDashboard/layout"
import GroupInvite from "./pages/dashboard/groupDashboard/groupInvite";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // 🔑 This checks and sets authUser on page refresh
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:id" element={<RoomPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />

        {/* Private Routes */}
        {/* <Route element={<PrivateRoute />}> */}
          <Route path="/profile" element={<Profile />} />

          {/* Dashboard Layout with Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />  {/* Default dashboard page */}
            <Route path="group" element={<GroupView />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="tasks/:groupId" element={<TaskPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="video-calls" element={<VideoCall />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="group/invite/:groupId" element={<GroupInvite/>}/>

            {/* Group-related routes */}
            <Route path="group-form" element={<CreateStudyGroupForm />} />
            <Route path="group/:groupId" element={<Layout />} />
            <Route path="update-group/:groupId" element={<UpdateGroup />} />
          </Route>
        {/* </Route> */}

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<div className="text-center mt-10 text-red-500 text-xl">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
