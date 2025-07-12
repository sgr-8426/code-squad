import React from "react";
import {
  ArrowRight,
  Users,
  BookOpen,
  Star,
  Clock,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignupPage from "./SignUpPage";

const LandingPage = () => {

  const navigate = useNavigate();
  const handleJoinNow = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillSwap
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Skills
              </button>
              <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={handleLogin}>
                Login
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105" onClick={handleJoinNow}>
                Join Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Trade Skills,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Build Communities
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with people in your area to exchange skills and knowledge.
            Teach what you know, learn what you need - all without spending
            money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center" onClick={handleJoinNow}>
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-medium transition-all">
              Browse Skills
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to start swapping skills
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. Create Profile
              </h3>
              <p className="text-gray-600">
                List the skills you can teach and what you'd like to learn
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Find & Connect
              </h3>
              <p className="text-gray-600">
                Browse local profiles and send swap requests
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Star className="h-12 w-12 text-green-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Swap & Learn
              </h3>
              <p className="text-gray-600">
                Meet up, exchange knowledge, and rate your experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SkillSwap?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for successful skill exchanges
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <Clock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600">
                Set your availability and find others with matching schedules
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <Shield className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Verified profiles and rating system ensure quality connections
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Local Community
              </h3>
              <p className="text-gray-600">
                Connect with people in your area for convenient meetups
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners and teachers in your community
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105" onClick={handleJoinNow}>
            Get Started Today
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">SkillSwap</span>
              </div>
              <p className="text-gray-400">
                Building communities through skill exchange
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Skills
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety Guidelines
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
