import React from "react";
import ErrorMonitoring from "../components/ErrorMonitoring";

/**
 * Test component for the Error Monitoring Dashboard
 * This component can be used to test the error monitoring functionality
 * independently from the main admin dashboard
 */
const TestErrorMonitoring: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Error Monitoring Test
          </h1>
          <p className="text-gray-600 mt-2">
            Testing the error monitoring dashboard integration with gateway
            (PORT 4000)
          </p>
        </div>

        {/* Error Monitoring Component */}
        <ErrorMonitoring />
      </div>
    </div>
  );
};

export default TestErrorMonitoring;
