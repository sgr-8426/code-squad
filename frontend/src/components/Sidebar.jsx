import React from "react";
import {
  BookOpen,
  TrendingUp,
  Award,
  Search,
  Users,
  Calendar,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition duration-200 ease-in-out lg:static lg:inset-0 z-20`}
    >
      <div className="flex items-center justify-between flex-shrink-0 w-64 h-full px-4 py-4 bg-white border-r border-gray-200">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillSwap
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "my-skills", label: "My Skills", icon: Award },
              { id: "find-skills", label: "Find Skills", icon: Search },
              { id: "swaps", label: "My Swaps", icon: Users },
              { id: "calendar", label: "Calendar", icon: Calendar },
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "profile", label: "Profile", icon: User },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
