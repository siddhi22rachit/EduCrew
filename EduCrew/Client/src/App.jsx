import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import Dashboard from "./pages/dashboard/landingPage";
import GroupView from "./pages/dashboard/groupView";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ResourcesPage from "./pages/dashboard/resources";
import LoginPage from "./pages/login/login";
import SignupPage from "./pages/login/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/profile/profile";

import CreateStudyGroupForm from "./pages/dashboard/createGroup/CreateStudyGroupForm";
import TaskPage from "./pages/dashboard/task";




import Group from "./pages/dashboard/createGroup/group"


import ChatPage from "./pages/dashboard/chat";
import VideoCall from "./pages/dashboard/Video_call/videoCall";
import RoomPage from "./pages/dashboard/Video_call/Room";
import CalendarPage from "./pages/dashboard/calender";
import UpdateGroup from "./pages/dashboard/createGroup/UpdateGroup";

export default function App() {
  return (
    <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:id" element={<RoomPage/>} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />

        {/* Private routes */}
        {/* <Route element={<PrivateRoute />}> */}
          <Route path='/profile' element={<Profile />} />

          {/* Dashboard routes nested under layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Index route for dashboard */}
            <Route index element={<Dashboard />} />

            {/* Dashboard sub-routes */}

            <Route path="group/:groupId" element={<GroupView />} />
            <Route path="chat" element={<ChatPage/>} />
            <Route path="tasks/:groupId" element={<TaskPage/>} />
            <Route path="calendar-page" element={<CalendarPage />} />
            <Route path="video-calls" element={<VideoCall/>} />
            <Route path="resources" element={<ResourcesPage />} />

            <Route path="group-form" element={<CreateStudyGroupForm />} />
            <Route path="group/:groupId" element={<Group />} />
            <Route path="task/:groupId" element={<TaskPage/>} />
            <Route path="update-group/:groupId" element={<UpdateGroup/>} />


            <Route path="group" element={ <GroupView/> } />
           
            <Route path="calendar-page" element={<CalendarPage/>} />
            <Route path="video-calls" element={<VideoCall/>} />
            <Route path="chat" element={<ChatPage/>} />
            <Route path="resources" element={<ResourcesPage />} />
          </Route>
        {/* </Route> */}

        {/* Catch-all route for 404 - place it last */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

