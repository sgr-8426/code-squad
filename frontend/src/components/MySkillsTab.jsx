import React from "react";
import { Plus, Edit, Eye } from "lucide-react";

const MySkillsTab = ({ mySkills, wantToLearn }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Skills</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Skills Offered */}
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

      {/* Skills to Learn */}
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
};

export default MySkillsTab;
