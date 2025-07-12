// src/components/FindSkillsTab.jsx
import React from "react";
import { Search } from "lucide-react";

const FindSkillsTab = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Find Skills</h3>
      <p className="text-gray-600">
        Search and discover new skills to learn from your community.
      </p>
    </div>
  );
};

export default FindSkillsTab;

