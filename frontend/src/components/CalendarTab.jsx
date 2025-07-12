// src/components/CalendarTab.jsx
import React from "react";
import { Calendar } from "lucide-react";

const CalendarTab = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar</h3>
      <p className="text-gray-600">
        Manage your skill swap sessions and appointments.
      </p>
    </div>
  );
};

export default CalendarTab;
