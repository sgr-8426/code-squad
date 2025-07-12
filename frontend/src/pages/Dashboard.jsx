import React, { useState } from "react";
import {
  BookOpen,
  User,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Plus,
  Star,
  MapPin,
  Clock,
  Users,
  Award,
  TrendingUp,
  Heart,
  Filter,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    location: "San Francisco, CA",
    rating: 4.8,
    completedSwaps: 23,
    skillsOffered: 5,
    skillsLearning: 3,
    joinDate: "January 2024",
  };

  const recentSwaps = [
    {
      id: 1,
      partner: "Sarah Wilson",
      skill: "Spanish Lessons",
      forSkill: "Web Development",
      date: "2025-01-15",
      status: "completed",
      rating: 5,
    },
    {
      id: 2,
      partner: "Mike Johnson",
      skill: "Guitar Lessons",
      forSkill: "Photography",
      date: "2025-01-10",
      status: "in-progress",
      rating: null,
    },
    {
      id: 3,
      partner: "Emma Davis",
      skill: "Cooking Classes",
      forSkill: "Yoga",
      date: "2025-01-08",
      status: "pending",
      rating: null,
    },
  ];

  const mySkills = [
    { id: 1, name: "Web Development", level: "Expert", requests: 12 },
    { id: 2, name: "Photography", level: "Advanced", requests: 8 },
    { id: 3, name: "Yoga", level: "Intermediate", requests: 5 },
    { id: 4, name: "Cooking", level: "Beginner", requests: 3 },
    { id: 5, name: "Spanish", level: "Advanced", requests: 7 },
  ];

  const wantToLearn = [
    { id: 1, name: "Guitar", priority: "High", matches: 15 },
    { id: 2, name: "Pottery", priority: "Medium", matches: 8 },
    { id: 3, name: "French", priority: "Low", matches: 12 },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Wilson",
      message: "Thanks for the great Spanish lesson! When's our next session?",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Mike Johnson",
      message: "Can we reschedule tomorrow's guitar lesson?",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      sender: "Emma Davis",
      message: "Looking forward to our cooking swap!",
      time: "1 day ago",
      unread: false,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Spanish Lesson with Sarah",
      date: "Jan 15, 2025",
      time: "2:00 PM",
      location: "Central Park",
      type: "teaching",
    },
    {
      id: 2,
      title: "Guitar Learning Session",
      date: "Jan 16, 2025",
      time: "4:00 PM",
      location: "Mike's Studio",
      type: "learning",
    },
    {
      id: 3,
      title: "Cooking Class",
      date: "Jan 18, 2025",
      time: "6:00 PM",
      location: "Community Kitchen",
      type: "learning",
    },
  ];

  const Sidebar = () => (
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

  const Header = () => (
    <header className="bg-white border-b border-gray-200 lg:pl-64">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
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
          <h1 className="text-2xl font-bold text-gray-900 ml-4 lg:ml-0">
            {activeTab.charAt(0).toUpperCase() +
              activeTab.slice(1).replace("-", " ")}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-900">
              {user.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Completed Swaps
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user.completedSwaps}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-2xl font-bold text-gray-900">{user.rating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Skills Offered
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user.skillsOffered}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Skills Learning
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user.skillsLearning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Swaps
          </h3>
          <div className="space-y-4">
            {recentSwaps.slice(0, 3).map((swap) => (
              <div
                key={swap.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://images.unsplash.com/photo-1494790108755-2616b612bfe5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                    alt={swap.partner}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {swap.partner}
                    </p>
                    <p className="text-xs text-gray-500">
                      {swap.skill} ↔ {swap.forSkill}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      swap.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : swap.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {swap.status}
                  </span>
                  {swap.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">
                        {swap.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      event.type === "teaching" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    <Calendar
                      className={`h-5 w-5 ${
                        event.type === "teaching"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const MySkillsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Skills</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mySkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {skill.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Level</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    skill.level === "Expert"
                      ? "bg-green-100 text-green-700"
                      : skill.level === "Advanced"
                      ? "bg-blue-100 text-blue-700"
                      : skill.level === "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {skill.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Requests</span>
                <span className="text-sm font-medium text-gray-900">
                  {skill.requests}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Skills I Want to Learn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wantToLearn.map((skill) => (
            <div key={skill.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    skill.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : skill.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {skill.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {skill.matches} matches available
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SwapsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Swaps</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Swap
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exchange
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSwaps.map((swap) => (
                <tr key={swap.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src="https://images.unsplash.com/photo-1494790108755-2616b612bfe5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt={swap.partner}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {swap.partner}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{swap.skill}</div>
                    <div className="text-sm text-gray-500">
                      ↔ {swap.forSkill}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {swap.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        swap.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : swap.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {swap.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {swap.rating ? (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900 ml-1">
                          {swap.rating}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MessagesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                message.unread ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612bfe5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt={message.sender}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-medium ${
                          message.unread ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {message.sender}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        message.unread ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
                {message.unread && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "my-skills":
        return <MySkillsTab />;
      case "swaps":
        return <SwapsTab />;
      case "messages":
        return <MessagesTab />;
      case "find-skills":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Find Skills
            </h3>
            <p className="text-gray-600">
              Search and discover new skills to learn from your community.
            </p>
          </div>
        );
      case "calendar":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar</h3>
            <p className="text-gray-600">
              Manage your skill swap sessions and appointments.
            </p>
          </div>
        );
      case "profile":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600">
              Update your profile information and preferences.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">
              Configure your account settings and preferences.
            </p>
          </div>
        );
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col">
        <Header />
        <main className="flex-1 p-6 sm:p-8">{renderContent()}</main>
      </div>
    </div>
  );
};
