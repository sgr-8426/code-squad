// src/Dashboard.jsx

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OverviewTab from "../components/OverviewTab";
import MySkillsTab from "../components/MySkillsTab";
import SwapsTab from "../components/SwapsTab";
import MessagesTab from "../components/MessagesTab";
import ProfileTab from "../components/ProfileTab";
import SettingsTab from "../components/SettingsTab";
import FindSkillsTab from "../components/FindSkillsTab";
import CalendarTab from "../components/CalendarTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Shared user + data state (mocked here)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    location: "San Francisco, CA",
    rating: 4.8,
    completedSwaps: 23,
    skillsOffered: ["Web Development", "Photography"], // changed to array
    skillsWanted: ["Guitar", "Pottery"], // new
    availability: "Weekends, 5-7 PM", // new
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

  const handleSearchFunction = (query) => {
    console.log("Searching for:", query);
    // You can implement actual search logic here later
  };

  // Render dynamic content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            user={user}
            recentSwaps={recentSwaps}
            upcomingEvents={upcomingEvents}
          />
        );
      case "my-skills":
        return <MySkillsTab mySkills={mySkills} wantToLearn={wantToLearn} />;
      case "swaps":
        return <SwapsTab recentSwaps={recentSwaps} />;
      case "messages":
        return <MessagesTab messages={messages} />;
      case "profile":
        return <ProfileTab user={user} />;

      case "settings":
        return <SettingsTab />;
      case "find-skills":
        return <FindSkillsTab />;
      case "calendar":
        return <CalendarTab upcomingEvents={upcomingEvents} />;
      default:
        return (
          <OverviewTab
            user={user}
            recentSwaps={recentSwaps}
            upcomingEvents={upcomingEvents}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          user={user}
          handleSearch={handleSearchFunction} // your search logic
        />

        <main className="flex-1 p-6 sm:p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
