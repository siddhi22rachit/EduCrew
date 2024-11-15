import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar';


const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
       
      </div>
    </div>
  );
};
export default DashboardLayout;