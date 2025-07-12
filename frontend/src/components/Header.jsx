import React from "react";
import { Menu, X, Search, Bell } from "lucide-react";
import { Link } from "react-router-dom"; // 🔁 Add this import

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  user,
  handleSearch,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 lg:pl-64">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu + Breadcrumb */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <nav className="text-sm font-semibold text-gray-700">
            <span className="text-gray-500">Dashboard</span>
            <span className="mx-1 text-gray-400">›</span>
            <span className="text-blue-600 font-bold">
              {activeTab.charAt(0).toUpperCase() +
                activeTab.slice(1).replace("-", " ")}
            </span>
          </nav>
        </div>

        {/* Right: Search + User Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)} // ✅ Call handler
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* ✅ Wrap profile in Link */}
          <Link
            to="/profile"
            className="flex items-center space-x-3 hover:bg-gray-100 p-1 rounded-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-900">
              {user.name}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
