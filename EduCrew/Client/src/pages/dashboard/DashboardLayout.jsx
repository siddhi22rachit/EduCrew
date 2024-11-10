import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import MusicPlayer from '../../components/mixplayer';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
        <MusicPlayer />
      </div>
    </div>
  );
};
export default DashboardLayout;