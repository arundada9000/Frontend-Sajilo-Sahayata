import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin" className="hover:text-indigo-400">
            Dashboard
          </Link>
          <Link to="/admin/reports" className="hover:text-indigo-400">
            Manage Reports
          </Link>
          <Link to="/admin/alerts" className="hover:text-indigo-400">
            Manage Alerts
          </Link>
          <Link to="/logout" className="hover:text-indigo-400">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
