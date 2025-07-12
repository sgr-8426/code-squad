import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Skill Swap!</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl">
        Exchange skills with others in your community. Learn what you want. Teach what you know.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
        >
          Join Now
        </Link>
        <Link
          to="/browse"
          className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-6 py-3 rounded shadow"
        >
          Browse Skills
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
