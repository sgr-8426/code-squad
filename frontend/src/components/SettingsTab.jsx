import React, { useState } from "react";
import { Settings } from "lucide-react";

const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);

  const handleSave = () => {
    // You can integrate API call here to save settings
    alert("Settings saved successfully!");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Settings className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Account Settings
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">
            Email Notifications
          </label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Enable Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Private Profile</label>
          <input
            type="checkbox"
            checked={privateProfile}
            onChange={(e) => setPrivateProfile(e.target.checked)}
            className="h-5 w-5"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
      >
        Save Changes
      </button>
    </div>
  );
};

export default SettingsTab;