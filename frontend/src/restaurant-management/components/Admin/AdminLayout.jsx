import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/*  Full-width Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600 pl-16">
          FoodFlix <span className="text-base font-normal">Admin</span>
        </h1>

        <span className="text-gray-600 text-sm">Welcome, Admin</span>
      </header>

      {/*  Sidebar + Content Row */}
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
