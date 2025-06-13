import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminDashboard from "../features/adminDashboard/pages/AdminDashboard";

const DemoApp: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">PgPaal Demo</h1>
            <Link
              to="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-7xl mx-auto p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to PgPaal Admin Dashboard Demo
                  </h2>
                  <p className="text-gray-600 mb-8">
                    A comprehensive admin dashboard for PG management with
                    real-time analytics and controls.
                  </p>
                  <Link
                    to="/admin"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Admin Dashboard
                  </Link>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Property Management
                    </h3>
                    <p className="text-gray-600">
                      Manage properties, view statistics, toggle status, and
                      track performance.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Room Operations
                    </h3>
                    <p className="text-gray-600">
                      Advanced room management with bulk operations and bed
                      tracking.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Real-time Analytics
                    </h3>
                    <p className="text-gray-600">
                      Interactive charts and metrics with Chart.js integration.
                    </p>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminDashboard userId="demo-admin" userName="Demo Admin" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default DemoApp;
