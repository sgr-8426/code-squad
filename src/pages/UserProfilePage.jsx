import React from 'react';

function UserProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-full w-24 h-24 mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">John Doe</h2>
          <p className="text-gray-600 mb-2">📍 Ahmedabad, India</p>
          <p className="text-gray-800 font-medium mb-4">Skills Offered: Web Development, UI Design</p>
          <p className="text-gray-800 font-medium mb-4">Skills Wanted: Machine Learning, Python</p>
          <p className="text-sm text-gray-500 mb-4">Available: Weekends, Evenings</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Request Skill Swap
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
