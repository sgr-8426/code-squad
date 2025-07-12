import React from "react";

const ProfileTab = ({ user }) => {
  if (!user) {
    return <div className="text-center">User data not available.</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-600">{user.location}</p>
      <p>
        <strong className="text-gray-700">Skills Offered:</strong>{" "}
        {user.skillsOffered?.join(", ") || "None"}
      </p>
      <p>
        <strong className="text-gray-700">Skills Wanted:</strong>{" "}
        {user.skillsWanted?.join(", ") || "None"}
      </p>
      <p>
        <strong className="text-gray-700">Availability:</strong>{" "}
        {user.availability || "Not set"}
      </p>
      <button
        onClick={() => alert("Swap Request Sent")}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Request Skill Swap
      </button>
    </div>
  );
};

export default ProfileTab;
