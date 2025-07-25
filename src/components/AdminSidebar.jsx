import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Bell,
  Users,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: <Home size={18} /> },
    { label: "Dashboard", to: "/admin", icon: <LayoutDashboard size={18} /> },
    {
      label: "Manage Users",
      to: "/admin/manage-users",
      icon: <Users size={18} />,
    },
    {
      label: "Manage Reports",
      to: "/admin/manage-reports",
      icon: <FileText size={18} />,
    },
    {
      label: "Manage Alerts",
      to: "/admin/send-alerts",
      icon: <Bell size={18} />,
    },
    { label: "Logout", to: "/logout", icon: <LogOut size={18} /> },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50 min-h-screen">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white bg-gray-800 p-2 rounded shadow"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 bg-gray-900 text-white transform transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
        ${
          mobileOpen
            ? "translate-x-0"
            : "md:translate-x-0 -translate-x-full md:relative"
        }`}
      >
        <div className={`p-4 flex flex-col h-full justify-between`}>
          {/* Toggle button */}
          <div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="mb-6 text-gray-400 hover:text-white"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>

            {!collapsed && (
              <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
            )}

            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition text-sm ${
                    location.pathname === item.to ? "bg-gray-800" : ""
                  }`}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {!collapsed && (
            <p className="text-xs text-gray-500 mt-6">© 2025 Sajilo Sahayata</p>
          )}
        </div>
      </aside>

      {/* Padding for main content */}
      <div
        className={`${
          collapsed ? "ml-8" : "ml-16"
        } transition-all duration-300 hidden md:block`}
      />
    </>
  );
}
